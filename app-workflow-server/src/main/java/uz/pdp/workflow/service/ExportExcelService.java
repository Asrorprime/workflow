package uz.pdp.workflow.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.binary.Base64;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.pdp.workflow.payload.ExcelRequestDynamic;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ExportExcelService {

    ResponseEntity<?> exportDataToExcel(ExcelRequestDynamic request) {
        List<Object> objects = request.getObjects();

        List<String> cols = request.getColumns();

        List<String> fields = request.getFields();
        String title = request.getTitle();

        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet(title);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, cols.size()));

        XSSFRow rowHead = sheet.createRow((short) 0);
        rowHead.setHeightInPoints(30);
        XSSFCell cellHead = rowHead.createCell(0);
        cellHead.setCellValue(title);

        XSSFFont font = workbook.createFont();
        font.setColor((short) 10);
        font.setFontHeightInPoints((short) 22);
        font.setColor(IndexedColors.WHITE.getIndex());
        XSSFCellStyle xssfCellStyle = workbook.createCellStyle();
        xssfCellStyle.setFont(font);
        rowHead.setRowStyle(xssfCellStyle);
        CellStyle styleHead = workbook.createCellStyle();
        styleHead.setBorderBottom(BorderStyle.THIN);
        styleHead.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        styleHead.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        styleHead.setAlignment(HorizontalAlignment.CENTER);
        styleHead.setFont(font);

        cellHead.setCellStyle(styleHead);
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        XSSFFont font1 = workbook.createFont();
        font1.setFontHeightInPoints((short) 14);
        style.setFont(font1);
        CellStyle styleCol = workbook.createCellStyle();

        styleCol.setAlignment(HorizontalAlignment.CENTER);
        XSSFFont fonLastCol = workbook.createFont();
        fonLastCol.setBold(true);
        XSSFFont fontCol = workbook.createFont();
        styleCol.setFont(fontCol);

        XSSFRow rowHeader = sheet.createRow((short) 1);
        rowHeader.createCell(0).setCellValue("T/R");
        rowHeader.getCell(0).setCellStyle(style);
        cols.forEach(item -> {
            rowHeader.createCell(cols.indexOf(item) + 1).setCellValue(item);
            rowHeader.getCell(cols.indexOf(item) + 1).setCellStyle(style);
        });

        ObjectMapper objectMapper = new ObjectMapper();
        int id = 1;
        for (Object item : objects) {
            XSSFRow row = sheet.createRow((short) objects.indexOf(item) + 2);
            row.createCell(0).setCellValue(id++);
            row.getCell(0).setCellStyle(style);
            boolean isBold = false;
            for (String field : fields) {
                Map map = objectMapper.convertValue(item, Map.class);
                if (map.get(field) instanceof Boolean) {
                    row.createCell(fields.indexOf(field) + 1).setCellValue(map.get(field).toString().equals("true") ? "Ha" : "Yo\'q");
                } else if (map.get(field) instanceof Double) {
                    row.createCell(fields.indexOf(field) + 1).setCellValue(Double.parseDouble(map.get(field).toString()));
                } else if (map.get(field) == null) {
                    isBold = true;
                    row.createCell(fields.indexOf(field) + 1);
                } else {
                    row.createCell(fields.indexOf(field) + 1).setCellValue(map.get(field).toString());
                }
                if (isBold)
                    styleCol.setFont(fonLastCol);
                row.getCell(fields.indexOf(field) + 1).setCellStyle(styleCol);
            }
        }

        if (cols.size() + 1 < 7) {
            for (int i = 0; i < cols.size() + 1; i++) {
                sheet.setColumnWidth(i, 8000);
            }
        } else {
            for (int i = 0; i < cols.size() + 1; i++) {
                sheet.autoSizeColumn(i);
            }
        }
        String encodedString = null;
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            workbook.write(byteArrayOutputStream);
            byteArrayOutputStream.close();
            encodedString = Base64.encodeBase64String(byteArrayOutputStream.toByteArray());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + title + ".xlsx\"")
                .body(encodedString);
    }
}
