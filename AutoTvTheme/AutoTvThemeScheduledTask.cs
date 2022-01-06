using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Library;
using MediaBrowser.Model.Entities;
using MediaBrowser.Model.Logging;
using MediaBrowser.Model.Tasks;

namespace AutoTvTheme
{
    public class AutoTagScheduledTask : IScheduledTask, IConfigurableScheduledTask
    {
        private ILibraryManager LibraryManager         { get; set; }
        private IUserManager UserManager               { get; set; }
        private ILogger Log                            { get; }
        private IMediaSourceManager MediaSourceManager { get; }

        public AutoTagScheduledTask(ILibraryManager libraryManager, IUserManager userManager, ILogManager logManager, IMediaSourceManager mediaSourceManager)
        {
            LibraryManager = libraryManager;
            UserManager    = userManager;
            MediaSourceManager = mediaSourceManager;
            Log = logManager.GetLogger(Plugin.Instance.Name);
        }

        public async Task Execute(CancellationToken cancellationToken, IProgress<double> progress)
        {
            ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;

            IEnumerable<MediaBrowser.Controller.Entities.TV.Series> series = GetSeriesFromLibrary();
            int count = 0;
            double currentPercent = 0.0;
            bool gotOne = false;

            //foreach (var serie in series)
            //{
            //    Log.Info(serie.Path + "   " + serie.Name  + "   " + serie.ThemeSongIds.Length);
            //}

            int total = series.OfType<MediaBrowser.Controller.Entities.TV.Series>().Count();

            foreach (var serie in series)
            {
                count++;

                if (serie.ThemeSongIds.Length == 0)
                {                   
                    string seriesName = serie.Name;
                    string themeSongPath = Path.Combine(serie.Path, "theme.mp3");

                    string basePageUrlTemplate = "https://www.televisiontunes.com/";
                    string downloadTemplate = "https://www.televisiontunes.com/song/download/";

                    string basePageUrl = basePageUrlTemplate + seriesName.Replace(' ', '_') + ".html";

                    string baseHtml = new WebClient().DownloadString(basePageUrl);

                    int startIndex = baseHtml.IndexOf("/song/download/");
                    Log.Debug(serie.Name + " index is " + startIndex.ToString());

                    if (startIndex != -1)
                    {
                        startIndex = startIndex + 15;
                        int endIndex = baseHtml.IndexOf("\"", startIndex);
                        string code = baseHtml.SubstringFromXToY(startIndex, endIndex);

                        string downloadUrl = downloadTemplate + code;

                        Log.Debug("Trying to download " + serie.Name + " from " + downloadUrl);

                        using (WebClient wc = new WebClient())
                        {
                            try
                            {
                                wc.DownloadFile(downloadUrl, themeSongPath);
                                Log.Info(serie.Name + " theme song succesfully downloaded");
                                gotOne = true;
                            }
                            catch 
                            {
                                string tvdb = serie.GetProviderId(MetadataProviders.Tvdb);
                                if (!string.IsNullOrEmpty(tvdb))
                                {
                                    string downloadUrl2 = $"http://tvthemes.plexapp.com/{tvdb}.mp3";
                                    Log.Debug("Trying to download " + serie.Name + " from " + downloadUrl2);

                                    using (WebClient wc2 = new WebClient())
                                    {
                                        wc2.DownloadFile(downloadUrl, themeSongPath);
                                        Log.Info(serie.Name + " theme song succesfully downloaded");
                                        gotOne = true;
                                    }
                                }
                                else
                                    Log.Debug("No TVDB Id found for " + serie.Name);
                            }
                        }
                    }
                    else
                    {
                        string tvdb = serie.GetProviderId(MetadataProviders.Tvdb);
                        if (!string.IsNullOrEmpty(tvdb))
                        {
                            string downloadUrl = $"http://tvthemes.plexapp.com/{tvdb}.mp3";
                            Log.Debug("Trying to download " + serie.Name + " from " + downloadUrl);

                            try
                            {
                                using (WebClient wc = new WebClient())
                                {
                                    wc.DownloadFile(downloadUrl, themeSongPath);
                                    Log.Info(serie.Name + " theme song succesfully downloaded");
                                    gotOne = true;
                                }
                            }
                            catch
                            {
                                Log.Info(serie.Name + " theme song not downloaded");
                            }
                        }
                        else
                            Log.Debug("No TVDB Id found for " + serie.Name);
                    }
                        
                }

                currentPercent = ((double) count / (double)total) * (double) 100;
                progress.Report(currentPercent);
            }

            progress.Report(100.0);

            if (gotOne == true)
            {
                LibraryManager.QueueLibraryScan();
                Log.Debug("Library scan queued");
            }
        }

        public IEnumerable<TaskTriggerInfo> GetDefaultTriggers()
        {
            return new[]
            {
                new TaskTriggerInfo
                {
                    Type          = TaskTriggerInfo.TriggerInterval,
                    IntervalTicks = TimeSpan.FromHours(12).Ticks
                }
            };
        }

        private IEnumerable<MediaBrowser.Controller.Entities.TV.Series> GetSeriesFromLibrary()
        {
            return LibraryManager.GetItemList(new InternalItemsQuery
            {
                IncludeItemTypes = new[] { nameof(MediaBrowser.Controller.Entities.TV.Series) },
                IsVirtualItem = false,
                Recursive = false
          //      HasTvdbId = true
            }).Select(m => m as MediaBrowser.Controller.Entities.TV.Series);
        }

        public string Name        => "Auto TV Theme Downloader";
        public string Key         => "TV Theme Downloader";
        public string Description => "Automatically download TV series theme music";
        public string Category    => "Library";
        public bool IsHidden      => false;
        public bool IsEnabled     => true;
        public bool IsLogged      => true;
    }

    #region Extensions
    public static class Extensions
    {
        /// <summary>
        /// Extracts the substring starting from 'start' position to 'end' position.
        /// </summary>
        /// <param name="s">The given string.</param>
        /// <param name="start">The start position.</param>
        /// <param name="end">The end position.</param>
        /// <returns>The substring.</returns>
        public static string SubstringFromXToY(this string s, int start, int end)
        {
            return s.Substring(start, end - start);
        }
    }
    #endregion Extensions
}
