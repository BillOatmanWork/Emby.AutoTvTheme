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

#pragma warning disable 1998
        public async Task Execute(CancellationToken cancellationToken, IProgress<double> progress)
#pragma warning restore 1998
        {
            ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;

            IEnumerable<MediaBrowser.Controller.Entities.TV.Series> Series = GetSeriesFromLibrary();
            int total = Series.Count();
            int count = 0;
            double currentPercent = 0.0;
            bool gotOne = false;

            foreach (MediaBrowser.Controller.Entities.TV.Series series in Series)
            {
                count++;

                if (series.ThemeSongIds.Length == 0)
                {                   
                    string seriesName = series.Name;
                    string themeSongPath = Path.Combine(series.Path, "theme.mp3");

                    if (getFromTvTunes(series, themeSongPath) == true)
                        gotOne = true;
                    else
                    {
                        if (getFromPlex(series, themeSongPath) == true)
                            gotOne = true;
                    }
                }

                currentPercent = ((double) count / (double)total) * (double) 100;
                progress.Report(currentPercent);
            }

            progress.Report(100.0);

            if (gotOne == true)
            {
                Log.Debug("Library scan queued");
                LibraryManager.QueueLibraryScan();              
            }
        }

        /// <summary>
        /// Attempt to download theme music from televisiontunes.com
        /// </summary>
        /// <param name="series"></param>
        /// <param name="themeSongPath"></param>
        /// <returns></returns>
        private bool getFromTvTunes(MediaBrowser.Controller.Entities.TV.Series series, string themeSongPath)
        {
            string seriesName = series.Name;
            string basePageUrlTemplate = "https://www.televisiontunes.com/";
            string downloadTemplate = "https://www.televisiontunes.com/song/download/";

            string basePageUrl = basePageUrlTemplate + seriesName.Replace(' ', '_').Replace(":", "").Replace(",", "").Replace("ᴺᵉʷ", "").Trim() + ".html";
            Log.Debug(basePageUrl);

            string baseHtml;

            try
            {
                baseHtml = new WebClient().DownloadString(basePageUrl);
            }
            catch(Exception ex)
            {
                Log.Debug($"{seriesName} base page URL exception: {ex.Message}");
                return false;
            }

            int startIndex = baseHtml.IndexOf("/song/download/");
            Log.Debug("Trying to download " + seriesName + " from primary source.");
            Log.Debug(seriesName + " index is " + startIndex.ToString());

            //if (startIndex == -1)
            //{
            //    string[] lines = baseHtml.Split('\n');
            //    foreach(string line in lines)
            //    {
            //        Log.Debug(line);
            //    }               
            //}

            if (startIndex != -1)
            {
                startIndex = startIndex + 15;
                int endIndex = baseHtml.IndexOf("\"", startIndex);
                string code = baseHtml.SubstringFromXToY(startIndex, endIndex);
                string downloadUrl = downloadTemplate + code;

                using (WebClient wc = new WebClient())
                {
                    try
                    {
                        wc.DownloadFile(downloadUrl, themeSongPath);
                        Log.Info(seriesName + " theme song succesfully downloaded from primary source.");
                        return true;
                    }
                    catch
                    {
                        Log.Debug(seriesName + " not found at primary source.");
                        return false;
                    }
                }
            }
            else
            {
                Log.Debug(series.Name + " not found at primry source.");
                return false;
            }
        }

        /// <summary>
        /// Attempt to download theme music from Plex site
        /// </summary>
        /// <param name="series"></param>
        /// <param name="themeSongPath"></param>
        /// <returns></returns>
        private bool getFromPlex(MediaBrowser.Controller.Entities.TV.Series series, string themeSongPath)
        {
            string seriesName = series.Name;
            string tvdb = series.GetProviderId(MetadataProviders.Tvdb);
            if (!string.IsNullOrEmpty(tvdb))
            {
                string downloadUrl = $"http://tvthemes.plexapp.com/{tvdb}.mp3";
                Log.Debug("Trying to download " + series.Name);

                try
                {
                    using (WebClient wc = new WebClient())
                    {
                        wc.DownloadFile(downloadUrl, themeSongPath);
                        Log.Info(seriesName + " theme song succesfully downloaded from backup source.");
                        return true;
                    }
                }
                catch
                {
                    Log.Info(seriesName + " theme song not downloaded from backup source.");
                }
            }
            else
                Log.Debug("No TVDB Id found for " + seriesName + " theme song not downloaded from backup source.");

            return false;
        }

        /// <summary>
        /// Configure the default triggers
        /// </summary>
        /// <returns></returns>
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

        /// <summary>
        /// Get list of TV series from Emby
        /// </summary>
        /// <returns></returns>
        private IEnumerable<MediaBrowser.Controller.Entities.TV.Series> GetSeriesFromLibrary()
        {
            return LibraryManager.GetItemList(new InternalItemsQuery
            {
                IncludeItemTypes = new[] { nameof(MediaBrowser.Controller.Entities.TV.Series) },
                IsVirtualItem = false,
                Recursive = false
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
