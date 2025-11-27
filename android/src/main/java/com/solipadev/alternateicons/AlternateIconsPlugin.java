package com.solipadev.alternateicons;

package com.example.appicon;

import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.PluginMethod;

import org.json.JSONException;

@CapacitorPlugin(name = "AlternateIcons")
public class AlternateIconsPlugin extends Plugin {

    @PluginMethod
    public void changeIcon(PluginCall call) {
        String targetAlias = call.getString("alias");
        JSArray aliases = call.getArray("aliases");

        if (targetAlias == null || targetAlias.isEmpty()) {
            call.reject("Parameter 'alias' is required");
            return;
        }

        if (aliases == null || aliases.length() == 0) {
            call.reject("Parameter 'aliases' is required");
            return;
        }

        Context context = getContext();
        PackageManager pm = context.getPackageManager();

        try {
            for (int i = 0; i < aliases.length(); i++) {
                String alias = aliases.getString(i);
                setAliasEnabled(context, alias, false);
            }

            setMainActivityEnabled(pm, false);
            setAliasEnabled(context, targetAlias, true);

            call.resolve();
        } catch (JSONException e) {
            call.reject("Error reading aliases", e);
        } catch (Exception e) {
            call.reject("Error changing icon", e);
        }
    }

    @PluginMethod
    public void resetIcon(PluginCall call) {
        JSArray aliases = call.getArray("aliases");

        if (aliases == null || aliases.length() == 0) {
            call.reject("Parameter 'aliases' is required");
            return;
        }

        Context context = getContext();
        PackageManager pm = context.getPackageManager();

        try {
            for (int i = 0; i < aliases.length(); i++) {
                String alias = aliases.getString(i);
                setAliasEnabled(context, alias, false);
            }

            setMainActivityEnabled(pm, true);

            call.resolve();
        } catch (Exception e) {
            call.reject("Error resetting icon", e);
        }
    }

    private void setAliasEnabled(Context context, String alias, boolean enabled) {
        PackageManager pm = context.getPackageManager();
        String pkg = context.getPackageName();

        String fullName;
        if (alias.startsWith(".")) {
            fullName = pkg + alias;
        } else if (!alias.contains(".")) {
            fullName = pkg + "." + alias;
        } else {
            fullName = alias;
        }

        ComponentName componentName = new ComponentName(context, fullName);

        pm.setComponentEnabledSetting(
            componentName,
            enabled
                ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP
        );
    }

    private void setMainActivityEnabled(PackageManager pm, boolean enabled) {
        ComponentName mainComponent = getActivity().getComponentName();

        pm.setComponentEnabledSetting(
            mainComponent,
            enabled
                ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP
        );
    }
}
