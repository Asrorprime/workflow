package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResPageable {
    private Object object;
    private Long totalElements;
    private Integer currentPage;
    private Integer totalPages;
    private String byField;

    public ResPageable(Object object, Long totalElements, Integer currentPage, Integer totalPages) {
        this.object = object;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
    }


}
