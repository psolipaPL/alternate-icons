import Foundation
import Capacitor
import UIKit

@objc(AlternateIconsPlugin)
public class AlternateIconsPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "AlternateIconsPlugin"
    public let jsName = "AlternateIcons"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "changeIcon", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resetIcon", returnType: CAPPluginReturnPromise),
    ]

    @objc func changeIcon(_ call: CAPPluginCall) {
        guard UIApplication.shared.supportsAlternateIcons else {
            call.reject("Alternate icons are not supported on this device")
            return
        }

        let aliasRaw = call.getString("alias") ?? ""
        let alias = aliasRaw.trimmingCharacters(in: .whitespacesAndNewlines)

        if alias.isEmpty {
            call.reject("Parameter 'alias' is required")
            return
        }

        guard let iconName = normalizeIconName(alias) else {
            call.reject("Invalid icon alias")
            return
        }

        setIcon(name: iconName, call)
    }

    @objc func resetIcon(_ call: CAPPluginCall) {
        guard UIApplication.shared.supportsAlternateIcons else {
            call.reject("Alternate icons are not supported on this device")
            return
        }

        setIcon(name: nil, call)
    }

    private func setIcon(name: String?, _ call: CAPPluginCall) {
        DispatchQueue.main.async {
            UIApplication.shared.setAlternateIconName(name) { error in
                if let error = error {
                    call.reject("Error changing icon: \(error.localizedDescription)")
                } else {
                    call.resolve()
                }
            }
        }
    }

    private func normalizeIconName(_ alias: String) -> String? {
        let trimmed = alias.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            return nil
        }

        if let dotIndex = trimmed.lastIndex(of: ".") {
            let next = trimmed.index(after: dotIndex)
            if next < trimmed.endIndex {
                return String(trimmed[next...])
            }
        }

        return trimmed
    }
}
