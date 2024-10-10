package com.ssafy11.api.service;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
//@Profile("real")
public class GptService implements ChatService{

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.api-amount}")
    private String apiAmount;

    @Value("${openai.api-message}")
    private String apiMessage;

    @Override
    public String getChatResponse(String prompt, Integer num) {
        if( num==1 ){ prompt += apiAmount; }
        else if( num==0 ){ prompt += apiMessage; }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("max_tokens", 500);
        requestBody.put("temperature", 1.0);
        requestBody.put("messages", new JSONArray()
                .put(new JSONObject().put("role", "user").put("content", prompt))
        );

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            // API 호출
            ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                // JSON 파싱
                JSONObject responseBody = new JSONObject(response.getBody());
                JSONArray choices = responseBody.getJSONArray("choices");
                String content = choices.getJSONObject(0).getJSONObject("message").getString("content");
                Assert.notNull(content, "Content is null");

                log.info("gpt 답변 : {}", content);

                if(num==1) {
                    String amount = extractAmount(content);
                    return amount != null ? amount : "금액을 찾을 수 없습니다.";
                }else if(num==0){
                    return content;
                }
                return content;
            } else {
                throw new ErrorException(ErrorCode.GPT_API_REQUEST_FAILED);
            }
        }catch (Exception e) {
            log.error("API 호출 중 예기치 않은 오류 발생: {}", e.getMessage());
            throw new ErrorException(ErrorCode.GPT_API_REQUEST_FAILED);
        }



    }

    private String extractAmount(String content) { //00만원 형식으로 파싱
        Pattern pattern = Pattern.compile("(\\d{1,3}(?:,\\d{3})*|\\d{1,3})\\s*(만원|원)", Pattern.CANON_EQ);
        Matcher matcher = pattern.matcher(content);

        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }
}
