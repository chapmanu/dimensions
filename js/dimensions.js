$(document).ready(function() {
  /*
  These limits are needed to prevent users from using large images to crop really small images.
  The ORIGINAL constants mark the largest images that can be used to crop images less than or
  equal to the dimensions of the CROPPED constants.
  See this issue for more details: https://github.com/chapmanu/dimensions/issues/29
  */
  const ORIGINAL_SMALL_IMAGE_WIDTH_LIMIT = 800;
  const ORIGINAL_SMALL_IMAGE_HEIGHT_LIMIT = 800;
  const CROPPED_SMALL_IMAGE_WIDTH_LIMIT = 400;
  const CROPPED_SMALL_IMAGE_HEIGHT_LIMIT = 400;

  var Resize = new function() {

    var $uploadCrop, $uploadedImage;

    this.readFile = function(input) {
      if(input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          $uploadedImage = new Image();
          $uploadedImage.src = e.target.result;

          $uploadedImage.onload = function() {
            Resize.originalWidth = Resize.imageWidth  = this.width;
            Resize.originalHeight = Resize.imageHeight = this.height;

            var ratio = (this.height * 1.0) / this.width;

            if($uploadCrop) $uploadCrop.destroy();

            Resize.viewPortWidth = Resize.imageWidth < $('.upload-msg').width() ? Resize.imageWidth : $('.upload-msg').width();
            Resize.viewPortHeight = ratio * parseInt(Resize.viewPortWidth, 10);

            $uploadCrop = Resize.newCroppie();

            $(".submit-btn").prop('href', '#');
            $(".preview-result").css('display', 'inline-block');
            $("#resize-select").css('display', 'inline-block');
            $("#user-width").css('display', 'inline-block').prop('max', Resize.originalWidth);
            $("#user-height").css('display', 'inline-block').prop('max', Resize.originalHeight);
          }
        }

        reader.readAsDataURL(input.files[0]);
      } else {
        swal("Unless you pressed cancel, your browser doesn't support the FileReader API");
      }
    }

    this.showResult = function() {
      $uploadCrop.result({
        type: 'blob',
        size: 'viewport',
        format: 'jpeg'
      }).then(function(img) {
        var imageUrl = Resize.imageUrlFromBlob(img);

        $(".download-crop").prop('href', imageUrl);
        Resize.popupResult({
          src: imageUrl
        });
      });
    }

    this.newCroppie = function() {
      var croppie = new Croppie(document.getElementById('upload-croppie'), {
        viewport: {
          width: Resize.viewPortWidth,
          height: Resize.viewPortHeight
        },
        boundary: {
          width: parseInt(Resize.viewPortWidth, 10) + 100,
          height: parseInt(Resize.viewPortHeight, 10) + 100
        }
      });
      croppie.bind({
        url: $uploadedImage.src
      });
      return croppie;
    }

    this.fillDimensionFields = function(self) {
      var data = $('#resize-select').find(':selected').data('dimensions');
      if(data.width <= Resize.originalWidth && data.height <= Resize.originalHeight){
        $("#user-width").val(data.width);
        $("#user-height").val(data.height);
        Resize.resizeCroppie();
      } else {
        alert("Your image is too small for the preset you have selected.");
        $("#resize-select").val($("#resize-select option:first").val());
      }
    }

    this.resizeCroppie = function() {
      if ($("#user-width").val()) Resize.viewPortWidth  = parseInt($("#user-width").val());
      if ($("#user-height").val()) Resize.viewPortHeight = parseInt($("#user-height").val());

      if($uploadCrop) $uploadCrop.destroy();
      $uploadCrop = Resize.newCroppie();
    }

    this.popupResult = function(result) {
      var html;
      if (result.html) {
        html = result.html;
      }
      if (result.src) {
        html = '<img src="' + result.src + '" />';
        html += '<a href="' + result.src + '" style="display:none; id="download-crop" download="cropped-image.jpg"></a>';
      }
      swal({
        title: 'Your Cropped Image',
        html: true,
        text: html,
        allowOutsideClick: true,
        showCancelButton: true,
        cancelButtonText: "Back",
        confirmButtonColor: "#A82439",
        confirmButtonText: "Download"
      },
      function(){
        $(".download-crop")[0].click();
        location.reload();
      });
    }

    this.imageUrlFromBlob = function(blob) {
      var urlCreator = window.URL || window.webkitURL;
      return urlCreator.createObjectURL(blob);
    }
  }

  $.getJSON("options.json", function(json) {
    var html = "";
    for(var group in json){
      html += "<optgroup label='" + group + "'>";
      for(var option in json[group]){
        html += "<option data-dimensions='" + JSON.stringify(json[group][option]) + "'>" + option + "</option>";
      }
      html += "</optgroup>";
    }

    document.getElementById("resize-select").innerHTML += html;
  });

  $(document).on('change', '#dimension_image_upload', function() { Resize.readFile(this); });
  $(document).on('change', '#resize-select', function() { Resize.fillDimensionFields(this); });
  $(document).on('click', '.submit-btn', function(event) { Resize.downloadableResult(); });
  $(document).on('click', '.preview-result', '#user-width, #user-height', function() {
    // Checks if the user selects dimensions that are less than or equal to "really small" image dimensions, and if the original dimensions are greater than the limit for cropping small images.
    if (($("#user-height").val() <= CROPPED_SMALL_IMAGE_HEIGHT_LIMIT && $("#user-width").val() <= CROPPED_SMALL_IMAGE_WIDTH_LIMIT) && (Resize.originalHeight > ORIGINAL_SMALL_IMAGE_HEIGHT_LIMIT && Resize.originalWidth > ORIGINAL_SMALL_IMAGE_WIDTH_LIMIT)) {
      alert("This image is too large to resize without distortions.\n\nYou will need to resize the image to be no larger than " + ORIGINAL_SMALL_IMAGE_WIDTH_LIMIT + "x" + ORIGINAL_SMALL_IMAGE_HEIGHT_LIMIT + " using a photo editor like Photoshop or GIMP.");
    } else {
      Resize.showResult();
    }
  });

  $(document).on('change', '#user-width, #user-height', function() {
    if($("#user-width").val() > Resize.originalWidth) $("#user-width").val(Resize.originalWidth);
    if($("#user-height").val() > Resize.originalHeight) $("#user-height").val(Resize.originalHeight);
    Resize.resizeCroppie();
    $("#resize-select").val($("#resize-select option:first").val());
  });
  
  $(document).on('click', '#instructions', function(event) {
    swal({
      title: "Instructions",
      text: '<ul><li>Upload an image you wish to resize</li><li>Select preset image dimensions from the dropdown menu, or input a custom width and height</li><li>Drag the image around until you find the crop you desire</li><li>Scale the size of the image with the slider at the bottom, or with your middle mouse button</li><li>When you are satisfied with how it looks, click "Crop Image"</li></ul>',
      html: true,
      allowOutsideClick: true
    });
    event.preventDefault();
  });
});