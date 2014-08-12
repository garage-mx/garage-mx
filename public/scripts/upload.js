$(document).ready(function() {
    status('Choose a file :)');
 
    // Check to see when a user has selected a file                                                                                                                
    $("#btnSubir").on("click",function() {
        if($('#productPhotoInput').val() !== '') {
            $('#uploadForm').submit();
        }
    });
 
    $('#uploadForm').submit(function() {
        status('uploading the file ...');
 
        $(this).ajaxSubmit({                                                                                                                 
            error: function(xhr) {
		      status('Error: ' + xhr.status);
            },
            success: function(response) {
		      status('Success upload');
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