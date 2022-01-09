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
        public override Guid Id             => new Guid("25CADBFE-A81B-457F-9889-0D65D9B00B5A");
        public Stream GetThumbImage()
        {
            var type = GetType();

            return type.Assembly.GetManifestResourceStream(type.Namespace + ".thumb.png");
        }
    }
}
