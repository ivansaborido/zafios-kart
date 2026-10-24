// Ajusta el proyecto Android que crea Capacitor:
// horizontal, pantalla completa, pantalla siempre encendida, voz (TTS) y número de versión.
const fs=require('fs'),path=require('path');
const A=path.join(__dirname,'..','android','app');
const run=process.env.GITHUB_RUN_NUMBER||'1';
// 1) AndroidManifest: horizontal y permiso para usar la voz del sistema
const mf=path.join(A,'src','main','AndroidManifest.xml');let m=fs.readFileSync(mf,'utf8');
if(!m.includes('screenOrientation'))m=m.replace('android:name=".MainActivity"','android:name=".MainActivity"\n            android:screenOrientation="sensorLandscape"');
if(!m.includes('TTS_SERVICE'))m=m.replace('<application','<queries>\n        <intent><action android:name="android.intent.action.TTS_SERVICE" /></intent>\n    </queries>\n\n    <application');
fs.writeFileSync(mf,m);
// 2) MainActivity: pantalla completa inmersiva y pantalla encendida
const pkg='com.planetazafios.kart';const dir=path.join(A,'src','main','java',...pkg.split('.'));fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'MainActivity.java'),`package ${pkg};

import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onResume() { super.onResume(); pantallaCompleta(); }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) { super.onWindowFocusChanged(hasFocus); if (hasFocus) pantallaCompleta(); }

    private void pantallaCompleta() {
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        c.hide(WindowInsetsCompat.Type.systemBars());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
}
`);
// 3) Versión: cada compilación sube el número (la Play Store lo exige)
const bg=path.join(A,'build.gradle');let g=fs.readFileSync(bg,'utf8');
g=g.replace(/versionCode \d+/,'versionCode '+run).replace(/versionName "[^"]*"/,'versionName "1.0.'+run+'"');
fs.writeFileSync(bg,g);
console.log('Android ajustado · versión 1.0.'+run);
