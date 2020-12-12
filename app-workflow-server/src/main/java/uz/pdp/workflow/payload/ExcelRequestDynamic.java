package uz.pdp.workflow.payload;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
public class ExcelRequestDynamic {
    private String title;
    private List<String> columns;
    private List<String> fields;
    private List<Object> objects;
    private Timestamp from = new Timestamp(1);
    private Timestamp to = new Timestamp(System.currentTimeMillis());

    public ExcelRequestDynamic(ExcelRequestDynamic request) {
        this.title = request.getTitle();
        this.columns = request.getColumns();
        this.fields = request.getFields();
        this.objects = request.getObjects();
        this.from = request.getFrom() == null ? new Timestamp(1) : request.getFrom();
        this.to = request.to == null ? new Timestamp(System.currentTimeMillis()) : request.getTo();
    }
}
