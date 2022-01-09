using System;
using System.IO;
using AutoTvTheme.Configuration;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Drawing;
using MediaBrowser.Model.Serialization;

namespace AutoTvTheme
{

    public class Plugin  : BasePlugin<PluginConfiguration>, IHasThumbImage
    {
        public static Plugin Instance { get; set; }
        public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer) : base(applicationPaths, xmlSerializer)
        {
            Instance = this;
        }

        public override string Name         => "Auto TV Theme Downloader";
        public ImageFormat ThumbImageFormat => ImageFormat.Png;
        public override Guid Id             => new Guid("C841F98A-2C8C-4CFB-A49F-5EC33936DA60");
        
        public Stream GetThumbImage()
        {
            var type = GetType();

            return type.Assembly.GetManifestResourceStream(type.Namespace + ".thumb.png");
        }

        //public IEnumerable<PluginPageInfo> GetPages() => new[]
        //{
        //    new PluginPageInfo
        //    {
        //        Name = "AutoTvThemeConfigurationPage",
        //        EmbeddedResourcePath = GetType().Namespace + ".Configuration.AutoTvThemeConfigurationPage.html",
        //    }
        //    //new PluginPageInfo
        //    //{
        //    //    Name = "AutoTvThemeConfigurationPageJS",
        //    //    EmbeddedResourcePath = GetType().Namespace + ".Configuration.AutoTvThemeConfigurationPage.js"
        //    //}
        //};
    }
}
