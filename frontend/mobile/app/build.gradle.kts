plugins {
    id("com.android.application")
}

android {
    namespace = "com.example.electrohive"
    compileSdk = 34

    defaultConfig {
        vectorDrawables.useSupportLibrary = true
        applicationId = "com.example.electrohive"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

dependencies {

    implementation ("com.github.bumptech.glide:glide:4.12.0")


    annotationProcessor ("com.github.bumptech.glide:compiler:4.12.0")

    // Appium Java client
    implementation ("io.appium:java-client:9.3.0" ) // Update to the latest version if needed

    //java-jwt
    implementation ("com.auth0:java-jwt:4.4.0")

    //socket io
    implementation ("io.socket:socket.io-client:2.1.0") // Adjust version as needed


    implementation ("me.relex:circleindicator:2.1.6")

    //powerspinner
    implementation ("com.github.skydoves:powerspinner:1.2.7")
    //viewpager2
    implementation ("androidx.viewpager2:viewpager2:1.0.0")
    implementation ("com.google.android.material:material:1.9.0")

    //retrofits
    implementation ("com.squareup.retrofit2:retrofit:2.9.0")
    implementation ("com.squareup.retrofit2:converter-gson:2.9.0")

    //Glide
    implementation ("com.github.bumptech.glide:glide:4.12.0")
    annotationProcessor ("com.github.bumptech.glide:compiler:4.12.0")

    // Selenium Java bindings
    implementation ("org.seleniumhq.selenium:selenium-java:4.23.0") // Update to the latest version if needed
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation ("androidx.drawerlayout:drawerlayout:1.2.0")
    implementation("androidx.constraintlayout:constraintlayout:2.2.0")
    implementation("androidx.activity:activity:1.9.3")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")


    // Include local .aar and .jar files
    implementation(fileTree(mapOf(
        "dir" to "libs",
        "include" to listOf("*.aar", "*.jar")
    )))

}