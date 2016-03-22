Batchcall.js
========

Batchcall.js is an extension of jQuery ajax function that make sending batch requests to the desire server super easy, just fill the parameters and data and it's done, leave the heavy lifting of on **Batchcall.js** to work for your batch request.

## What is batch request ##

Batch requests allow grouping multiple operations, as described in [OData:Core], into a single HTTP request payload. A batch request MUST be represented as a Multipart MIME v1.0 message [RFC2046], a standard format allowing the representation of multiple parts, each of which may have a different content type (as described in [OData:Atom], [OData:JSON] and [OData:JSONVerbose]), within a single request. This feature allows you to decrease the traffic between the server and the client dramatically making the entire communication much less "chatty" (and therefore, making your API more scalable).


Batch Request Headers
======================
Batch requests MUST be submitted as a single HTTP POST request to the batch endpoint of a service, which MUST be located at the URI <Service Root URI>/$batch. Service Root URIs are defined in [OData:Core].

The batch request MUST contain a Content-Type header specifying a content type of “multipart/mixed” and a boundary specification as defined in [RFC2046]. <Batch Request Body> is defined in the Batch Request Body section below.

        POST /service/$batch HTTP/1.1
        Host: odata.org
        DataServiceVersion: 1.0 
        MaxDataServiceVersion: 3.0 
        Content-Type: multipart/mixed; boundary=batch_36522ad7-fc75-4b56-8c71-56071383e77b
    
    <--Batch Request Body-->

Finally, batch requests MUST NOT include an X-HTTP-Method header (i.e. use POST tunelling) as batch requests are by definition POST only.

Batch Request Body
=================
The body of a batch request MUST be made up of an ordered series of query operations and/or ChangeSets. A query operation in the context of a batch request is either a query or Function invocation request as described in [OData:Core]. A ChangeSet is an atomic unit of work consisting of an unordered group of one or more of the insert/update/delete operations, Action invocations or Service Operation invocations described in [OData:Core]. ChangeSets MUST NOT contain query operations and MUST NOT be nested (i.e. a ChangeSet cannot contain a ChangeSet).

    POST /service/$batch HTTP/1.1 
    Host: host 
    Content-Type: multipart/mixed; boundary=batch_36522ad7-fc75-4b56-8c71-56071383e77b 
    
    --batch_36522ad7-fc75-4b56-8c71-56071383e77b
    Content-Type: application/http 
    Content-Transfer-Encoding:binary
    
    GET /service/Customers('ALFKI') 
    Host: host
    
    --batch_36522ad7-fc75-4b56-8c71-56071383e77b 
    Content-Type: multipart/mixed; boundary=changeset_77162fcd-b8da-41ac-a9f8-9357efbbd621 
    Content-Length: ###       
   
    --changeset_77162fcd-b8da-41ac-a9f8-9357efbbd621 
    Content-Type: application/http 
    Content-Transfer-Encoding:binary 
    
    PUT /service/Customers('ALFKI') HTTP/1.1 
    Host: host 
    Content-Type: application/json 
    If-Match: xxxxx 
    Content-Length: ### 
    
    <JSON representation of Customer ALFKI> 
    
    --changeset_77162fcd-b8da-41ac-a9f8-9357efbbd621-- 
   
    --batch_36522ad7-fc75-4b56-8c71-56071383e77b--


**Further learning about Batch Request **[OData Version 3.0 documentation]****

http://www.odata.org/documentation/odata-version-3-0/batch-processing/

## Using the code ##

The batching support is implemented via ```oDataBatchAjaxCall``` method which can be called on a global jQuery object. The semantics of ```oDataBatchAjaxCall``` method are more or less the same as with the native ```ajax``` method.

Below is an example of performing a batch request to a handler available at ```/api/batch```:

```javascript

 var requestParams = [];
 requestParams.push({
	'requestType'    : 'PUT', //method type
    'crudWhereClause': '/service/Customers('ALFKI')', //CRUD Where clause
    'data'           : modelData //JSON properly formatted data, could be collection
                                });
$.oDataBatchAjaxCall(requestParams);
```

## Dependencies ##

Batch.js depends on jQuery >= 1.5.x (although, this dependency can easily be eliminated). The library also takes advantage of the native JSON library (e.g. ```parse``` and ```stringify``` methods). Please refer to https://github.com/douglascrockford/JSON-js if you're targeting browsers that don't support JSON object natively.

## Support ##

Currently batchcall.js only supports ```application/json``` as content type (and therefore, enforces it when sending the request and receiving the response).
