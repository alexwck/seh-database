// Listen to AJAX request from the wheel route

// Create Wheel Form in views/wheel/index.ejs
$('#createWheelForm').submit(function(e){
    // Prevent form from submitting
    e.preventDefault();
    // Pulls the input value from the form, maps it to the name attribute
    let wheelData = $(this).serialize();
    $.post('/wheels', wheelData, function(data){
        console.log(data)
        $('.tableBody').append(
            `<tr style="text-align: center;" >
            <td>
                <a href="/wheels/${data._id}/ingots"> ${data.wheel.serialNo} - ${data.wheel.batchNo} </a>
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
            <td>
                <button class="btn btn-warning btn-sm editWheelButton">Edit Wheel</button>
            </td>
            <td>${data.wheel.ingots.length}</td>
            <td>
                ${ !data.wheel.machine ? "" :`${data.wheel.machine}`}
                <form action="/wheels/${data._id}/?_method=PUT" method="POST" class="editMachineForm" autocomplete="off">
                    <div class="form-row align-items-center">
                        <div class="col-auto">
                            <label class="sr-only" for="machine">Machine</label>
                            <input id="machine" type="text" name="machine" value="${data.wheel.machine}" class="form-control">
                        </div>
                        <div class="col-auto">
                            <button type="submit" class="btn btn-primary">Update</button>
                        </div>
                    </div>
                </form>
            </td>
            <td>
                <button class="btn btn-warning btn-sm editMachineButton">Edit Machine</button>
            </td>
            <td>${ !data.wheel.isCompleted ? `Incomplete` : `Completed`}</td>
            <td>
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
    $(document).ajaxStop(function(){
        window.location.reload()
    });
});

// Create Edit Wheel Form in views/wheel/index.ejs
$('.tableBody').on('click', '.editWheelButton', function(){
    $(this).parent().siblings().find('.editWheelForm').toggle();
})

// Create Edit Machine Form in view/wheel/index.ejs
$('.tableBody').on('click', '.editMachineButton', function(){
    $(this).parent().siblings().find('.editMachineForm').toggle();
})

// UPDATE Wheel
$('.tableBody').on('submit', '.editWheelForm', function(e){
    e.preventDefault();

    // Return serialNo=1&batchNo=3
    let formData = $(this).serialize();
    // Return /wheels/:wheel_id/?_method=PUT
    let formAction = $(this).attr('action');
    // Return /wheels/:wheel_id/ingots
    let wheelId = $(this).parent().children('a').attr("href");
    
    // Return <tr></tr>
    $originalItem = $(this).parent().parent()
    $.ajax({
        url: formAction,
        data: formData,
        type: 'PUT',
        originalItem: $originalItem,
        success: function(data){
            this.originalItem.html(
                `
                <td>
                    <a href="${wheelId}"> ${data.wheel.serialNo} - ${data.wheel.batchNo} </a>
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
                <td>
                    <button class="btn btn-warning btn-sm editWheelButton">Edit Wheel</button>
                </td>
                <td>${data.wheel.ingots.length}</td>
                <td>
                    ${ !data.wheel.machine ? "" :`${data.wheel.machine}`}
                    <form action="${formAction}" method="POST" class="editMachineForm" autocomplete="off">
                        <div class="form-row align-items-center">
                            <div class="col-auto">
                                <label class="sr-only" for="machine">Machine</label>
                                <input id="machine" type="text" name="machine" value="${data.wheel.machine}" class="form-control">
                            </div>
                            <div class="col-auto">
                                <button type="submit" class="btn btn-primary">Update</button>
                            </div>
                        </div>
                    </form>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm editMachineButton">Edit Machine</button>
                </td>
                <td>${ !data.wheel.isCompleted ? `Incomplete` : `Completed`}</td>
                <td>
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

$('.tableBody').on('submit', '.editMachineForm', function(e){
    e.preventDefault();

    // Return machine=cm28
    let formData = $(this).serialize();
    // Return /wheels/:wheel_id/?_method=PUT
    let formAction = $(this).attr('action');
    // Return /wheels/:wheel_id/ingots
    let wheelId = $(this).parent().children('a').attr("href");
   
    // Return <tr></tr>
    $originalItem = $(this).parent().parent()
    $.ajax({
        url: formAction,
        data: formData,
        type: 'PUT',
        originalItem: $originalItem,
        success: function(data){
            this.originalItem.html(
                `
                <td>
                    <a href="${wheelId}"> ${data.wheel.serialNo} - ${data.wheel.batchNo} </a>
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
                <td>
                    <button class="btn btn-warning btn-sm editWheelButton">Edit Wheel</button>
                </td>
                <td>${data.wheel.ingots.length}</td>
                <td>
                    ${ !data.wheel.machine ? "" :`${data.wheel.machine}`}
                    <form action="${formAction}" method="POST" class="editMachineForm" autocomplete="off">
                        <div class="form-row align-items-center">
                            <div class="col-auto">
                                <label class="sr-only" for="machine">Machine</label>
                                <input id="machine" type="text" name="machine" value="${data.wheel.machine}" class="form-control">
                            </div>
                            <div class="col-auto">
                                <button type="submit" class="btn btn-primary">Update</button>
                            </div>
                        </div>
                    </form>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm editMachineButton">Edit Machine</button>
                </td>
                <td>${ !data.wheel.isCompleted ? `Incomplete` : `Completed`}</td>
                <td>
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

// DELETE
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
        // Cancel the active state after cancelling the delete request
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