package com.solipadev.alternateicons;

import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

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
                setAliasEnabled(context, pm, alias, false);
            }

            setAliasEnabled(context, pm, targetAlias, true);

            call.resolve();
        } catch (JSONException e) {
            call.reject("Error reading aliases", e);
        } catch (Exception e) {
            call.reject("Error changing icon", e);
        }
    }

    @PluginMethod
    public void resetIcon(PluginCall call) {
        String defaultAlias = call.getString("defaultAlias");
        JSArray aliases = call.getArray("aliases");

        if (defaultAlias == null || defaultAlias.isEmpty()) {
            defaultAlias = ".testicon";
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
                setAliasEnabled(context, pm, alias, false);
            }

            setAliasEnabled(context, pm, defaultAlias, true);

            call.resolve();
        } catch (Exception e) {
            call.reject("Error resetting icon", e);
        }
    }

    private void setAliasEnabled(Context context, PackageManager pm, String alias, boolean enabled) {
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
}
