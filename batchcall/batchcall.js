/**
 * batchcall.js
 *
 * @desc      Batch Call is a slim lib for oData batch request
 * @author    Nadeem Ur-Rehman (nadeem.reyhman@gmail.com)
 * @copyright 2015 - present
 * @version   2.0.2
 **/

(function ($) {
    /**
     * Format the given requests into the batch and returns batch contents.
     */
    var batchBody = function (args, boundary) {
        var batchContent = new Array();

        var changeSetNum = parseInt((Math.random() * 100), 10);
        batchContent.push('--batch_' + boundary);
        batchContent.push('Content-Type: multipart/mixed; boundary=changeset_'+changeSetNum);
        batchContent.push('');

        $.each(args.data, function (i, val) {
          batchContent.push('--changeset_'+changeSetNum);
          batchContent.push('Content-Type: application/http');
          batchContent.push('Content-Transfer-Encoding: binary');
          batchContent.push('');

          batchContent.push( args.requestType.toUpperCase() + ' ' + args.crudWhereClause + ' HTTP/1.1');
          batchContent.push('Content-Type: application/json');
          batchContent.push('');
          batchContent.push(JSON.stringify(val));
          batchContent.push('');
        });

        batchContent.push('--changeset_'+ changeSetNum + '--');
        batchContent.push('--batch_' + boundary + '--');
        //console.log(batchContent);
        return batchContent.join('\r\n');
    }

    var validateParams = function (params) {
        var ret = true;
        var records = params.data;
        ret = records.length>0;
        ret = params.requestType!=='';
        ret = params.crudWhereClause!=='';

      return ret;

    }

     $.extend($, {
        /**
         * Sends the given oData batch as ajax call.
         * Before placing call, system will validate if mandatory fields are provided.
         * @param {object} params Request parameters.
         */
        oDataBatchAjaxCall: function (params) {
            var boundary = new Date().getTime().toString();
            var validated = validateParams(params);

            if (validated) { //before sending batch request, first validate if the required parameteres are filled in.
            var batchRequestBody = batchBody(params, boundary);
            var sapURL =  window.appState.globals.appConfig.hostNameSpace+'$batch';

              $.ajax({
                  method: 'POST',
                  url: sapURL,
                  data: batchRequestBody,
                  beforeSend: function (xhr){
                    /* Here you set any header required by the batch request*/

                    //xhr.setRequestHeader('Authorization', 'Basic sfsdf);
                    //xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
                    xhr.setRequestHeader('Content-Type','multipart/mixed; boundary=batch_'+boundary);
                  },
                  //dataType: 'json',
                  success:function(res){
                    console.log(res, 'success');
                 },
                 error:function(e){
                     console.error(e, 'error');
                 }
             });
            }
            else{
              console.error('Please fill the mandatory fields');
            }
        }
    });
})(jQuery);
