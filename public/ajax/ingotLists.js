$(document).ready(function(){
    $('#ingot').on("keypress", function(){
        let inputval = $(this).val();
        if (inputval.indexOf('-') > -1){
            let order = inputval.split('-')[0].trim();
            let lot =  inputval.split('-')[1].substring(0,5);
            $(this).val(order + `-` + lot );
        }
        if(event.which == 13) {
            // Do regex test before passing into the function
            let rgx = new RegExp('^[a-zA-Z]{3}([a-zA-Z]| ){1}\\d{3}[-]{1}[a-zA-Z\\d]{5}$',"g");
            if (rgx.test(inputval) === false){
                alert("Sila ikut format yang terpapar atas halaman")
            } else{
                createIngot(inputval);
            }
        }
    })

    $('.list').on('click', 'button', function(e){
        e.stopPropagation();
        let confirmResponse = confirm('Are you sure?');
        if(confirmResponse){
            let clickedId = $(this).parent(".listGroup").attr('id');
            let currentpath = window.location.pathname;
            let deleteUrl = currentpath + "/" + clickedId;
            $itemToDelete = $(this).parent(".listGroup");
            $.ajax({
                url: deleteUrl,
                type: 'DELETE',
                itemToDelete: $itemToDelete,
                success: function(data){
                    this.itemToDelete.remove();
                }
            })
        } else{
            // Cancel the active state after cancelling the delete request
            $(this).blur();
        }
    })

    $('.completeWheel input[type="checkbox"]').click(function(){
        let updateUrl = window.location.pathname;
        $.ajax({
            method: 'PUT',
            url: updateUrl,
            success: function(data){
                if(data.isCompleted === true){
                    $('.completeWheel input[type="checkbox"]').prop('checked', true)
                } else{
                    $('.completeWheel input[type="checkbox"]').prop('checked', false)
                }
            }
        })
    });
});

function createIngot(inputval){
    let inputAction = window.location.pathname;
    $.ajax({
        type: "POST",
        url:  inputAction,
        data: {order: inputval.split('-')[0].trim(), lot: inputval.split('-')[1].substring(0,5)},
        success: function(data) {
            $('#ingot').val('');
            display(data);
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                alert(xhr.responseJSON.error);
            }
            if (xhr.status === 500) {
                alert(xhr.responseJSON.error);
            }
        }
    });
}

function display(ingot){
    let newIngot = $(`
    <div class="listGroup" id=${ingot._id}>
        <li class="task"> ${ingot.order} - ${ingot.lot}</li>
        <button type="submit" class="btn btn-danger btn-sm" >Delete</button>
    </div>
     `  
    );
    $('.list').append(newIngot);
}