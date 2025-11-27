import Foundation
import Capacitor

@objc(AlternateIconsPlugin)
public class AlternateIconsPlugin: CAPPlugin {
    private let implementation = AlternateIcons()

    @objc override public func load() {
    }

    @objc public func changeIcon(_ call: CAPPluginCall) {
        implementation.changeIcon(call)
    }

    @objc public func resetIcon(_ call: CAPPluginCall) {
        implementation.resetIcon(call)
    }
}
