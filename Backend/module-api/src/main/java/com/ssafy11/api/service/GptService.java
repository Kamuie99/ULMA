package com.ssafy11.api.service;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
//@Profile("real")
public class GptService {

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    @Value("${openai.api-key}")
    private String apiKey;

    public String getChatResponse(String prompt, Integer num) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo"); // 또는 사용하려는 모델
        requestBody.put("max_tokens", 500);
        requestBody.put("temperature", 1.0);
        requestBody.put("messages", new JSONArray()
                .put(new JSONObject().put("role", "user").put("content", prompt))
        );

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        // API 호출
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, String.class);


        if (response.getStatusCode() == HttpStatus.OK) {
            // JSON 파싱
            JSONObject responseBody = new JSONObject(response.getBody());
            JSONArray choices = responseBody.getJSONArray("choices");
            String content = choices.getJSONObject(0).getJSONObject("message").getString("content");
            Assert.notNull(content, "Content is null");

            System.out.println(content);
            if(num==1) {
                String amount = extractAmount(content);
                return amount != null ? amount : "금액을 찾을 수 없습니다.";
            }else if(num==0){
                return content;
            }
            return content;
        } else {
            throw new RuntimeException("Failed to get response: " + response.getStatusCode());
        }
    }

    private String extractAmount(String content) { //00만원만 파싱
        Pattern pattern = Pattern.compile("(\\d+)(만원)");
        Matcher matcher = pattern.matcher(content);

        if (matcher.find()) {
            return matcher.group();
        }
        return null; //반환값이 없는 경우 null
    }
}
