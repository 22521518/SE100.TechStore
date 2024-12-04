package com.example.electrohive.utils;

import retrofit2.Response;

public class ApiErrorParser {
    public static String parseErrorBody(Response<?> response) {
        try {
            return response.errorBody() != null ? response.errorBody().string() : "Unknown error";
        } catch (Exception e) {
            return "Error parsing error response: " + e.getMessage();
        }
    }
}
