var id;
img_array = []
var counter = 0
let rev = 0;
function readURL(input) { 
    if (input.files) {
        Object.keys(input.files).forEach(i => {
            const file = input.files[i];
            var reader = new FileReader();
            reader.onload = function(e) {
                img_array.push([counter,e.target.result,file]);
                counter = counter + 1
                image = 'url('+e.target.result +')';
                image_name = file.name;
                image_size = file.size;
                image_size = formatBytes(image_size)
                if(!check_if_cards_exists()){
                    document.getElementById('uploaded_box').innerHTML = '<h1>Uploaded Image</h1><div class="card_con" id="card_con"></div>'
                    generate_card(image, image_name, image_size)
                }
                else{
                    generate_card(image, image_name, image_size)
                }
            }
            reader.readAsDataURL(file);
        })
    }
    
    else if (input) {
        var reader = new FileReader();
        reader.onload = function(e) {
            img_array.push([counter,e.target.result,input]);
            counter = counter + 1
            image = 'url('+e.target.result +')';
            image_name = input.name;
            image_size = input.size;
            image_size = formatBytes(image_size)
            if(!check_if_cards_exists()){
                document.getElementById('uploaded_box').innerHTML = '<h1>Uploaded Image</h1><div class="card_con" id="card_con"></div>'
                generate_card(image, image_name, image_size)
            }
            else{
                generate_card(image, image_name, image_size)
            }
        }
        reader.readAsDataURL(input);
    }
}
function generate_card(image, image_name, image_size){
    document.getElementById('card_con').innerHTML += '<div class="uploaded_card" id='+ counter +'> <div class="avatar-preview"><div id="imagePreview" class="fadein"  style="background-image:'+ image +';"></div></div><div class="img_values"><div class="title">'+image_name+'</div><small>'+ image_size+'</small></div><div class="cancel_card" onclick = "delete_card(this)"><i class="bx bx-x" ></i></div></div>'
    avatar_preview = document.getElementsByClassName('avatar-preview')
    for (let i = 0; i < avatar_preview.length; i++) {
        avatar_preview[i].style.opacity = '0';
        setTimeout(function(){avatar_preview[i].classList.add("fadein")}, 200);
    }
}
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function delete_card(that){
    id = that.parentNode.id - 1
    img_array.forEach(delete_card_from_array)
    that.parentNode.remove()
    if(!check_if_cards_exists()){
        document.getElementById('uploaded_box').innerHTML = ''
    }
}
function delete_card_from_array(item,arr){
    if(item[0] == id){
        img_array.splice(arr,1)
        return true
    }
}
function check_if_cards_exists(){
    if(document.getElementsByClassName('uploaded_card').length !== 0){
        return true;
    }
    else{
        return false;
    }
}
function dragOverHandler(ev) {
    ev.preventDefault();
}
function dropHandler(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          readURL(file)
        }
      });
    }
}
function analyse(){
    document.getElementById('analyse_button').classList.add('analyse_active')
    document.getElementById('analyse_button').innerHTML = '<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg>'
    setTimeout(function() {
        if(check_if_cards_exists()){
            cancel_button = document.getElementsByClassName('cancel_card')
            for (let i = 0; i < cancel_button.length; i++) {
                cancel_button[i].remove()
            }
            document.getElementById('first_con').style.display = 'none';
            document.getElementById('second_con').style.display = 'block'; 
            document.getElementById('back').classList.remove('display_none')
            if(img_array.length > 1){
                show_buttons()
            }
            for (let i = 0; i < img_array.length; i++) {
                exif_this = getExif(img_array[i][1])
                exif_data = EXIF.pretty(exif_this);
                if(exif_data == ''){
                    exif_data = 'No Exif Data Found.'
                    my_location = ''
                }
                else{
                    exif_data = exif_data.split(/[,]+/);
                        my_location = get_location(exif_this)
                        if(!my_location == ''){
                            my_location = '<div class="info_cons"><div class="info_con_title">GPS Location<div class="dropdown_icon" onclick="dropdown_toggle(this)"><i class="bx bx-chevron-down"></i></div></div><pre id="allMetaDataSpan">' + 'Latitude: ' + my_location[0] + '<br>' +  'Latitude Degree: '+ my_location[1] + '<br>' + 'Latitude Minutes: ' + my_location[2] + '<br>' + 'Latitude Seconds: ' + my_location[3] + '<br>' + '<br>' + 'Longtitude: ' + my_location[4] + '<br>' +  'Longtitude Degree: ' + my_location[5] + '<br>' + 'Longtitude Minutes: ' + my_location[6] + '<br>' + 'Longtitude Seconds: ' + my_location[7] + '<br>'+ '</pre>'+ my_location[8] +'<div class="button" style="margin:25px" >Google Maps</div></a></div>'    
                        }
                    }         
                document.getElementById('second_con').innerHTML += '<div class="second_mini_cons"><div class="second_img_con" style="background-image: url('+ img_array[i][1] +')"></div><div class="second_data_con"><div id="second_data_title">' + img_array[i][2].name + '</div><div id="second_data_sub_title">' + 'Last modified: '+ normal_date(img_array[i][2].lastModified) + '</div>' + '<div class="info_cons"><div class="info_con_title">General Information<div class="dropdown_icon" onclick="dropdown_toggle(this)"><i class="bx bx-chevron-down"></i></div></div><pre id="allMetaDataSpan">' + 'Image size: ' + formatBytes(img_array[i][2].size) + '<br>' + 'Image type: '+ img_array[i][2].type + '</pre></div>'+'<div class="info_cons"><div class="info_con_title">Exif Data<div class="dropdown_icon" onclick="dropdown_toggle(this)"><i class="bx bx-chevron-down"></i></div></div><pre id="allMetaDataSpan">' + exif_data + '</pre></div>' + my_location +'</div></div>'
                carousel(rev);
    
            }
        }
        else{
            letter_index_open('Error', 'Please attach a file before analysing it!')
        }
    }, 1000);
}
function getExif(value) {
    var data;
    var img2 = new Image();
    img2.src = value;
    EXIF.getData(img2, function() {
        data = this;
    });
    return data
}
function letter_index_open(type, message, cta = 'OK'){
    document.getElementById('popup').innerHTML = '<h1>'+ type +'<small>' + message + '</small><div class="button" onclick="letter_index_close()">'+ cta +'</div>'
    document.getElementById('dimmer').style.display = 'flex';
}
function letter_index_close(){
    document.getElementById('dimmer').style.display = 'none';
    document.getElementById('analyse_button').classList.remove('analyse_active')
    document.getElementById('analyse_button').innerHTML = 'Analyse'
}
function get_location(myData){
    if(myData.exifdata.GPSLatitude || myData.exifdata.GPSLongitude){
        var latDegree_nom = myData.exifdata.GPSLatitude[0].numerator;
        var latDegree_denom = myData.exifdata.GPSLatitude[0].denominator;
        var latDegree =  latDegree_nom / latDegree_denom;

        var latMinute_nom = myData.exifdata.GPSLatitude[1].numerator;
        var latMinute_denom = myData.exifdata.GPSLatitude[1].denominator;
        var latMinute = latMinute_nom / latMinute_denom
        
        var latSecond_nom = myData.exifdata.GPSLatitude[2].numerator;
        var latSecond_denom = myData.exifdata.GPSLatitude[2].denominator;
        var latSecond = latSecond_nom / latSecond_denom

        var latDirection = myData.exifdata.GPSLatitudeRef;
        var latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection);


        var lonDegree_nom = myData.exifdata.GPSLongitude[0].numerator;
        var lonDegree_denom = myData.exifdata.GPSLongitude[0].denominator;
        var lonDegree =  lonDegree_nom / lonDegree_denom;

        var lonMinute_nom = myData.exifdata.GPSLongitude[1].numerator;
        var lonMinute_denom = myData.exifdata.GPSLongitude[1].denominator;
        var lonMinute = lonMinute_nom / lonMinute_denom
        
        var lonSecond_nom = myData.exifdata.GPSLongitude[2].numerator;
        var lonSecond_denom = myData.exifdata.GPSLongitude[2].denominator;
        var lonSecond = lonSecond_nom / lonSecond_denom

        var lonDirection = myData.exifdata.GPSLongitudeRef;
        var lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
        var link = '<a href="http://www.google.com/maps/place/'+latFinal+','+lonFinal+'" target="_blank">'
        return [latFinal, latDegree, latMinute, latSecond, lonFinal, lonDegree, lonMinute, lonSecond, link];
    }
    else{
        return ''
    }
    
}
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes/60) + (seconds/3600);
    if (direction == "S" || direction == "W") {
        dd = dd * -1; 
    }
    return dd;
}
function dropdown_toggle(that){
    that.parentNode.nextElementSibling.classList.toggle('display_none')
    if(that.firstElementChild.classList.contains('bx-chevron-down')){
        that.firstElementChild.classList.toggle('bx-chevron-up')
    }
    else{
        that.firstElementChild.classList.toggle('bx-chevron-down')
    }
}
function normal_date(val){
    const milliseconds = val// 1575909015000

    const dateObject = new Date(milliseconds)

    const humanDateFormat = dateObject.toLocaleString() //2019-12-9 10:30:15

    dateObject.toLocaleString("en-US", {weekday: "long"}) // Monday
    dateObject.toLocaleString("en-US", {month: "long"}) // December
    dateObject.toLocaleString("en-US", {day: "numeric"}) // 9
    dateObject.toLocaleString("en-US", {year: "numeric"}) // 2019
    dateObject.toLocaleString("en-US", {hour: "numeric"}) // 10 AM
    dateObject.toLocaleString("en-US", {minute: "numeric"}) // 30
    dateObject.toLocaleString("en-US", {second: "numeric"}) // 15
    dateObject.toLocaleString("en-US", {timeZoneName: "short"}) // 12/9/2019, 10:30:15 AM CST
    return humanDateFormat
}   
function show_buttons(){
    document.getElementById('next').classList.remove('display_none')
    document.getElementById('prev').classList.remove('display_none')
}
function previousReview() {
    rev = rev - 1;
    carousel(rev);
}
function nextReview() {
    rev = rev + 1;
    carousel(rev);
}
function backReview() {
    window.location.reload();
}
function carousel(review) {
    let reviews = document.getElementsByClassName("second_mini_cons");

    if (review >= reviews.length) {
        review = 0;
        rev = 0;
    }
    if (review < 0) {
        review = reviews.length - 1;
        rev = reviews.length - 1;
    }
    for (let i = 0; i < reviews.length; i++) {
        reviews[i].style.display = "none";
    }
    reviews[review].style.display = "flex";
}
// No CORS wont let this work!
// function link_upload(that){
//     isvalid = validURL(that.value)
//     if(isvalid){
//         var img2 = new Image();
//         img2.src = that.value;

//         fetch(that.value)
//         .then(function (response) {
//            return response.blob();
//         })
//         .then(function (blob) {
//             readURL(blob)
//         });
//     }
//     else{
//         letter_index_open('Error', 'Please upload a valid URL. eg: https://www.google.com')
//     }
// }
// function validURL(str) {
//     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//       '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//       '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//       '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//     return pattern.test(str);
// }