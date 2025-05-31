package io.vason;

import org.apache.poi.ooxml.POIXMLProperties;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.net.URL;

@SuppressWarnings("unused")
public class Demo {
    static class DoubleContainer {
        private final double value = 13.37;
    }

    public static String ping() {
        return "pong";
    }

    public static String getContentType() throws IOException {
        URL spreadsheetUrl = Demo.class.getResource("/spreadsheet.xlsx");
        assert spreadsheetUrl != null;

        try (InputStream input = spreadsheetUrl.openStream()) {
            try (XSSFWorkbook workbook = new XSSFWorkbook(input)) {
                POIXMLProperties properties = workbook.getProperties();
                return  properties.getCoreProperties().getUnderlyingProperties().getContentType();
            }
        } catch (Exception e) {
            System.err.println("Error opening XSSFWorkbook: " + e.getMessage());

            //noinspection CallToPrintStackTrace
            e.printStackTrace();
            throw e;
        }
    }

    public static double getDoubleValue() throws NoSuchFieldException, IllegalAccessException {
        DoubleContainer container = new DoubleContainer();
        Field field = DoubleContainer.class.getDeclaredField("value");
        field.setAccessible(true);

        // Accessing the field using reflection
        Double fieldValue = (Double) field.get(container);
        return fieldValue;
    }

    public static void main(String[] args) throws Exception {
        assert ping().equals("pong");
        assert getContentType().equals("application/vnd.openxmlformats-package.core-properties+xml");
        assert getDoubleValue() == 13.37;
    }
}
