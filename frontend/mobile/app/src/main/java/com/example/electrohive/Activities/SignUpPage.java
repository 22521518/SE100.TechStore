package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.R;

public class SignUpPage extends AppCompatActivity {
    protected TextView log_in_button;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.signup_page);

        log_in_button = findViewById(R.id.loginBackLinkTextView);

        log_in_button.setOnClickListener(v->signIn());
    }

    private void signIn() {
        Intent intent = new Intent(SignUpPage.this,LoginPage.class);
        startActivity(intent);
    }

}
