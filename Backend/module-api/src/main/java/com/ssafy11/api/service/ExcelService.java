package com.ssafy11.api.service;

import com.ssafy11.api.dto.ExcelParse;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelService {
    private static final Logger log = LoggerFactory.getLogger(ExcelService.class);

    public List<ExcelParse> parseExcelFile(MultipartFile file) {
        List<ExcelParse> parsedDataList;

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowCount = sheet.getPhysicalNumberOfRows();

            // 열 인덱스를 찾기 위한 메서드 호출
            int[] columnIndices = findColumnIndices(sheet, rowCount);
            int nameColIndex = columnIndices[0];
            int categoryColIndex = columnIndices[1];
            int amountColIndex = columnIndices[2];

            int startRowIndex = columnIndices[3];

            if (nameColIndex == -1 || amountColIndex == -1) {
                throw new ErrorException(ErrorCode.EXCEL_PARSING_FAILED);
            }

            // 엑셀 데이터 파싱
            parsedDataList = parseRows(sheet, startRowIndex, rowCount, nameColIndex, categoryColIndex, amountColIndex);
        } catch (Exception e) {
            log.error("엑셀 파싱에 실패하였습니다.", e);
            throw new ErrorException(ErrorCode.BadRequest);
        }

        if (parsedDataList.isEmpty()) {
            log.error("일치하는 파일 내용이 없습니다.");
            throw new ErrorException(ErrorCode.NO_CONTENT);
        }

        return parsedDataList;
    }

    private int[] findColumnIndices(Sheet sheet, int rowCount) {
        int nameColIndex = -1;
        int categoryColIndex = -1;
        int amountColIndex = -1;
        int startRowIndex = -1;

        // 첫 번째 행에서 열 인덱스 찾기
        for (int rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            Row row = sheet.getRow(rowIndex);
            if (row != null) {
                for (int cellIndex = 0; cellIndex < row.getPhysicalNumberOfCells(); cellIndex++) {
                    Cell cell = row.getCell(cellIndex);
                    if (cell != null) {
                        String cellValue = cell.toString().replaceAll("\\s", "").trim();
                        if (cellValue.contains("성명") || cellValue.contains("이름")) {
                            nameColIndex = cellIndex;
                        } else if (cellValue.contains("관계")) {
                            categoryColIndex = cellIndex;
                        } else if (cellValue.contains("금액")) {
                            amountColIndex = cellIndex;
                        }
                    }
                }

                // 모든 인덱스를 찾았으면 루프 종료
                if (nameColIndex != -1 && categoryColIndex != -1 && amountColIndex != -1) {
                    startRowIndex = rowIndex + 1; // 데이터가 시작되는 행은 다음 행
                    break;
                }
            }
        }

        return new int[]{nameColIndex, categoryColIndex, amountColIndex, startRowIndex};
    }

    private List<ExcelParse> parseRows(Sheet sheet, int startRowIndex, int rowCount, int nameColIndex, int categoryColIndex, int amountColIndex) {
        List<ExcelParse> parsedDataList = new ArrayList<>();

        for (int rowIndex = startRowIndex; rowIndex < rowCount; rowIndex++) {
            Row row = sheet.getRow(rowIndex);
            if (row == null) continue;

            String name = null;
            String category = null;
            Integer amount = null;

            if (nameColIndex != -1) {
                Cell nameCell = row.getCell(nameColIndex);
                name = nameCell != null ? nameCell.toString().trim() : null;
            }

            if (categoryColIndex != -1) {
                Cell categoryCell = row.getCell(categoryColIndex);
                category = categoryCell != null ? categoryCell.toString().trim() : null;
            }

            if (amountColIndex != -1) {
                Cell amountCell = row.getCell(amountColIndex);
                if (amountCell != null) {
                    if (amountCell.getCellType() == CellType.NUMERIC) {
                        amount = (int) amountCell.getNumericCellValue();
                    }
                    if (amount != null) {
                        String amountString = amount.toString().replaceAll("[^\\d]", "");
                        amount = amountString.isEmpty() ? null : Integer.parseInt(amountString);
                    }
                }
            }

            if (name != null && !name.isEmpty() && amount != null) {
                parsedDataList.add(new ExcelParse(name, category, amount));
            }
        }

        return parsedDataList;
    }
}
