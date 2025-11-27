#import <Capacitor/Capacitor.h>

CAP_PLUGIN(AlternateIconsPlugin, "AlternateIcons",
    CAP_PLUGIN_METHOD(changeIcon, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(resetIcon, CAPPluginReturnPromise);
)
