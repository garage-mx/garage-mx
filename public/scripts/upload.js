$(document).ready(function() {
    status('Seleccione una imagen');
 
    // Check to see when a user has selected a file                                                                                                                
    $("#btnSubir").on("click",function() {
        if($('#productPhotoInput').val() !== '') {
            $('#uploadForm').submit();
        }
    });
 
    $('#uploadForm').on("submit", function() {
        status('Transfiriendo archivo...');
 
        $(this).ajaxSubmit({                                                                                                                 
            error: function(xhr) {
		      status('Error: ' + xhr.status);
            },
            success: function(response) {
                console.log(response);
		      status('Transferencia satisfactoria');
            }
	});
 
	// Have to stop the form from submitting and causing                                                                                                       
	// a page refresh - don't forget this                                                                                                                      
	return false;
    });
 
    function status(message) {
	   $('#status').text(message);
    }
});