import '../js/vendors/dropzone'

$.fn.Uploader = function (config) {
    'use strict';

    function handle_coverimage_uploaded(response)
    {
        var $image = $This.find('.uploader-thumbnail-container img');
        var $PreviewContainer = $This.find('.uploader-preview-container');
        var $Content = $(`<div class="uploaded-item">
                            <div class="controls">
                                <a href="javascript:;" data-role="remove-uploaded"><i class="fa fa-trash"></i></a>
                            </div></div>`);
        
        $This.find('.uploader-preview-container').removeClass('uploading');
        $This.find('.error-container').empty();

        if (response && response.issuccess) {
            $(`<input type="hidden" name="path" value='${response.data.fileUrl}' />`).appendTo($Content);
        }

        if (response.data.isImage) {
            if ($image.length && $.getAttr({ target: $image, attr: 'src', def: '' }).length > 0) {
                $image.appendTo($Content);
            }
            else {
                $(`<img src="${response.data.fileUrl}" alt="" />`).appendTo($Content);
            }
        }
        else {
            var extension = response.data.fileUrl.getExtension().toLowerCase();
            $(`<span class="extension">.${extension}</span>`).appendTo($Content);
        }

        $PreviewContainer.remove();
        $Content.appendTo($This.parent());

        

        $Content.find('[data-role="remove-uploaded"]').on('click', function () {
            $Content.addClass('remove');
            window.setTimeout(function () {
                $This.removeClass('hidden');
                $Content.remove();
            }, 500);
            
        });

        $This.addClass('hidden');
    }

    function handle_attachment_uploaded(response) {
    }

    var _defaultPreviewTemplate = `
    <div class="uploader-preview-container uploading">
        <div class="uploader-thumbnail-container ">
            <img data-dz-thumbnail />
            <div class="uploader-progress-container">
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated " data-dz-uploadprogress></div>
                </div>
            </div>
        </div>
        <div class="error-container"><span data-dz-errormessage></span></div>
    </div>`;

    var settings = $.extend({
        url: '~/upload',
        maxFiles: null,
        maxFilesize: 2, // MB
        paramName: "file", // The name that will be used to transfer the file
        headers: {
            // RequestVerificationToken: __antiforgeryToken
        },
        acceptedFiles: null,
        addRemoveLinks: false,
        forceChunk: true,

        
        dictDefaultMessage: "فایل را بکشید و در اینجا رها کنید",
        dictFallbackMessage: "مرورگر شما از این مورد پشتیبانی نمیکند",
        dictFallbackText: "از آپلود پیش فرض مرورگر استفاده کنید",
        dictFileTooBig: "حجم فایل زیاد است (محدودیت حجم : {{maxFilesize}})",
        dictInvalidFileType: "نوع فایل ارسال شده معتبر نمی باشد",
        dictResponseError: "خطای سمت سرور ({{statusCode}})",
        dictCancelUpload: "لغو آپلود",
        dictUploadCanceled: "آپلود لغو شد",
        dictCancelUploadConfirmation: "مطمئن هستید می خواهید آپلود را لغو کنید ؟",
        dictRemoveFile: "حذف فایل",
        dictRemoveFileConfirmation: "مطمئن هستید می خواهید فایل را حذف کنید ؟",
        dictMaxFilesExceeded: "حداکثر تعداد فایل برای آپلود، {{maxFiles}} است",
        dictFileSizeUnits: "kb",
        previewTemplate: _defaultPreviewTemplate,

        renameFile: function (file) { },
        accept: function (file, done) {
            done();
        },

        type : 'coverimage',
        onSuccess: function (event, response) { },
        onInit: function (event, response) { }
    }, config);

    var $This = $(this);

    settings.init = function (event) {
        if (settings.onInit && typeof (settings.onInit) === 'function') {
            settings.onInit(event,$This);
        }
    }

    var $uploader = $This.dropzone(settings);
    var uploaderDropzone = $uploader[0].dropzone;
    
    uploaderDropzone.on('success', function (event, response) {
        if (settings.type.toLowerCase() === 'coverimage') {
            handle_coverimage_uploaded(response);
        }
        else {
            handle_attachment_uploaded(response);
        }
        if (settings.onSuccess && typeof (settings.onSuccess) === 'function') {
            settings.onSuccess(event,response);
        }   
    });

    uploaderDropzone.on('sending', function (file) {
        if (file.type) {
            switch (file.type.split('/')[0].toLowerCase()) {
                case ("image"):break;
                default:
                    var extension = file.name.getExtension().toLowerCase();
                    $(`<span class="extension">.${extension}</span>`).appendTo($This.find('.uploader-thumbnail-container'));
                    break;
            }
        }
    });

    uploaderDropzone.on('drop', function (file) {
        $This.find('.uploader-preview-container').remove();
    });
    uploaderDropzone.on('thumbnail', function (file) {
    });

    return uploaderDropzone;
}