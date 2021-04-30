
$(".addParties").click(function () {
    //var html = '<div class="form-group col-md-6 padding-top-10" id="nv">';
    //html += '<label class="col-md-4 control-label">Tên sản phẩm</label>';
    //html += '<div class="col-md-8">';
    //html += '<select name="IdProduct">';
    //html += '<option>Chọn sản phẩm</option>';
    //html += '@foreach (var item in @ViewBag.lstPro){';
    //html += '<option value="@item.Id">@item.Name</option>}';
    //html += '</select>';
    //html += '</div>';
    //html += '</div>';
    //html += '<div class="form-group col-md-4 padding-top-10" id="tenbh">';
    //html += '<label class="col-md-4 control-label">Số lượng</label><div class="col-md-8"><input type="text" class="form-control" name="Number"></div>';
    //html += '</div>';
    //html += '<div class="form-group col-md-2 padding-top-10" id="tenbh">';
    //html += '<button type="button" class="addParties" onclick="addProduct(this)"> + Thêm sản phẩm</button>';
    //html += '</div>';
    var html = $("#nv1");
    $("#pro").append(html);
    
})
$('document').ready(function () {
    var url = $("#Ahihi").val();
    $.ajax({
        type: "GET",
        url: url,
        "dataType": "Json",
        success: function (data) {
            $(data).each(function (i) {
                var append = data[i].Id + data[i].Name;
                $("#pro").append(append);
            });
        }
    });
})
                                    
                                
                                
                                    
                                
                                
                                    
                                
