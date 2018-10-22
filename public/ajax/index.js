$('#createWheelForm').submit(function(e){
    e.preventDefault();
    let wheelData = $(this).serialize();
    $.post('/wheels', wheelData, function(data){
        $('.tableBody').append(
            `<tr>
            <td><a href="/wheels/${data._id}/ingots"> ${data.wheel.serialNo} - ${data.wheel.batchNo} </a>
                <form action="/wheels/${data._id}/?_method=PUT" method="POST" class="editWheelForm" autocomplete="off">
                    <div class="form-row align-items-center">
                        <div class="col-auto">
                            <label class="sr-only" for="serialNo">Serial Number</label>
                            <input id="serialNo" type="text" name="serialNo" value="${data.wheel.serialNo}" class="form-control">
                        </div>
                        <div class="col-auto">
                            <label class="sr-only" for="batchNo">Batch Number</label>
                            <input id="batchNo" type="text" name="batchNo" value="${data.wheel.batchNo}" class="form-control">
                        </div>
                        <div class="col-auto">
                            <button type="submit" class="btn btn-primary">Update</button>
                        </div>
                    </div>
                </form>
            </td>
            <td>Number of Ingots</td>
            <td>
                <button class="btn btn-warning btn-sm editWheelButton">Edit</button>
                ${ data.user !== undefined && data.user.isAdmin ? 
                    `
                    <form style="display:inline" method="POST" action="/wheels/${data.wheel._id}" class="deleteWheelForm" autocomplete="off">
                        <button type="submit" class="btn btn-danger btn-sm" >Delete</button>
                    </form>
                    ` 
                : ''
                }
            </td>
            </tr>`
        );
        $('#createWheelForm').find('.form-control').val('');
    });
});

$('.tableBody').on('click', '.editWheelButton', function(){
    $(this).parent().siblings().find('.editWheelForm').toggle();
})

$('.tableBody').on('submit', '.editWheelForm', function(e){
    e.preventDefault();

    let formData = $(this).serialize();
    let formAction = $(this).attr('action');
    let wheelId = $(this).parent().children('a').attr("href");

    $originalItem = $(this).parent().parent()
    $.ajax({
        url: formAction,
        data: formData,
        type: 'PUT',
        originalItem: $originalItem,
        success: function(data){
            this.originalItem.html(
                `
                <td><a href="${wheelId}"> ${data.wheel.serialNo} - ${data.wheel.batchNo} </a>
                    <form action="${formAction}" method="POST" class="editWheelForm" autocomplete="off">
                        <div class="form-row align-items-center">
                            <div class="col-auto">
                                <label class="sr-only" for="serialNo">Serial Number</label>
                                <input id="serialNo" type="text" name="serialNo" value="${data.wheel.serialNo}" class="form-control">
                            </div>
                            <div class="col-auto">
                                <label class="sr-only" for="batchNo">Batch Number</label>
                                <input id="batchNo" type="text" name="batchNo" value="${data.wheel.batchNo}" class="form-control">
                            </div>
                            <div class="col-auto">
                                <button type="submit" class="btn btn-primary">Update</button>
                            </div>
                        </div>
                    </form>
                </td>
                <td>Number of Ingots</td>
                
                <td>
                    <button class="btn btn-warning btn-sm editWheelButton">Edit</button>
                    ${ data.user !== undefined && data.user.isAdmin ? 
                        `
                        <form style="display:inline" method="POST" action="/wheels/${data.wheel._id}" class="deleteWheelForm" autocomplete="off">
                            <button type="submit" class="btn btn-danger btn-sm" >Delete</button>
                        </form>
                        ` 
                    : ''
                    }
                </td>
                `
            )
        }
    });
})

$('.tableBody').on('submit', '.deleteWheelForm', function(e){
    e.preventDefault();
    
    let confirmResponse = confirm('Are you sure?');
    if(confirmResponse){
        let formAction = $(this).attr('action');
        $itemToDelete = $(this).parent().parent()
        $.ajax({
            url: formAction,
            type: 'DELETE',
            itemToDelete: $itemToDelete,
            success: function(data){
                this.itemToDelete.remove();
            }
        });
    } else{
        $(this).find('button').blur();
    }
});

$("[data-toggle=popover]").popover({
    html : true,
    trigger: 'hover',
    placement: 'left',
    content: function() {
        let content = $(this).attr("data-popover-content");
        return $(content).children(".popover-body").html();
    }
});