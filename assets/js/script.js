var addTask = document.getElementById('addTask');
var takeBreak = document.getElementById('takeBreak');
var backFromBreak = document.getElementById('backFromBreak');
var totalBreak = document.getElementById('totalBreak');

var breakStart = document.getElementById('breakStart');
var breakEnd = document.getElementById('breakEnd');
var totalhrs = document.getElementById('totalhrs');
var computedTotal = stringToInt(totalhrs.value);

var id = 5;
var breakId = 0;
var tabIndex = 37;
dataRow = 7;

var tasks = [];
var priorities = [];
var duedates = [];
var techLevels = [];
var completions = [];
var estimatedHrs = [];
var actualHrs = [];
var clockIns = [];
var clockOuts = [];
var allStartBreaks = [];
var allEndBreaks = [];
var allTotalBreaks = [];
var allProj = [];
var projCounter = [];

$('#submitBtn').click(function(){
    successModal();
    var fullname = $('#userName').text();
    var receiveremail = document.getElementById('receiveremail').value;
    // var user = document.getElementById('users').value;
    var totalHrsBreak = $('#allBreaks').text();

    $('.task').each(function(){
        tasks.push($(this).val());
    });

    $('.priority').each(function(){
        priorities.push($(this).val());
    });
    
    $('.duedate').each(function(){
        duedates.push($(this).val());
    });

    $('.tech-level').each(function(){
        techLevels.push($(this).val());
    });

    $('.completion').each(function(){
        completions.push($(this).val());
    });

    $('.estimated-hr').each(function(){
        if($(this).val() == "00:00:00"){
            estimatedHrs.push(0);
        } else {
            // var convertedDec = decTohhmm($(this).val());
            estimatedHrs.push(convertTime($(this).val()));
        }
    });

    $('.actual-hr').each(function(){
        if($(this).val() != ""){
            actualHrs.push(convertTime($(this).val()));
        } else {
            actualHrs.push(0);
        }
    });

    $('.clockin').each(function(){
        clockIns.push($(this).val());
    });

    $('.clockout').each(function(){
        clockOuts.push($(this).val());
    });

    $('.break-start').each(function(){
        allStartBreaks.push($(this).text());
    });

    $('.break-end').each(function(){
        allEndBreaks.push($(this).text());
    });

    $('.total-break').each(function(){
        allTotalBreaks.push($(this).text());
    });

    $('.proj').each(function(){
        allProj.push($(this).val());
    });

    $('.proj-count').each(function(){
        projCounter.push($(this).text());
    });

    $.ajax({
        url: "http://127.0.0.1:8080/http://127.0.0.1:8000/store_data",
        method: "POST",
        data: {
            tasks,
            priorities,
            duedates,
            techLevels,
            completions,
            estimatedHrs,
            actualHrs,
            clockIns,
            clockOuts,
            fullname,
            receiveremail,
            // user,
            allStartBreaks,
            allEndBreaks,
            allTotalBreaks,
            totalHrsBreak,
            allProj,
            projCounter
        },
        success: function(data){
            $('#successModal').modal();
        }
    })
});

$('#prevScor').on('click', function(){
    var dateToday = new Date();
    var yesterDate = new Date(dateToday);
    yesterDate.setDate(yesterDate.getDate() - 1);

    var yesterday = formatDate(yesterDate.toDateString());

    $.ajax({
        url: "http://127.0.0.1:8080/http://127.0.0.1:8000/fetch_prev_scorecard",
        data: {
            yesterday
        },
        success: function(data){
            var prevScorData = JSON.parse(data);

            for(let i = 0; i < prevScorData.title.length; i++){
                var prevtask = document.getElementById(`task${i+1}`);
                var prevPrio = document.getElementById(`priority${i+1}`);
                var prevDueDate = document.getElementById(`duedate${i+1}`);
                var prevTechlvl = document.getElementById(`techlvl${i+1}`);
                var prevCompletion = document.getElementById(`completion${i+1}`);
                var prevEstHr = document.getElementById(`esthr${i+1}`);
                // console.log(prevtask);
                prevtask.value = prevScorData.title[i];
                prevPrio.value = prevScorData.priority[i];
                prevDueDate.value = prevScorData.duedate[i];
                prevTechlvl.value = prevScorData.techlvl[i];
                prevCompletion.value = prevScorData.completion[i];
                prevEstHr.value = decTohhmm(prevScorData.estimatedhr[i]);
            }
        },
        error: function(xhr){
            errorPrevScor();
            $('#errorPrevScorModal').modal();
        }
        
    });
});

$(document).ready(function(){
    loginModal();
    $('#loginModal').modal();
    $('input[type="text"]').prop('readonly', true);
    $('button[type="button"]').prop('disabled', true);
    $('select').prop('disabled', true);
    $( "#datepicker" ).datepicker();

    // $.ajax({
    //     url: "http://127.0.0.1:8080/http://127.0.0.1:8000/fetch_users",
    //     success: function(data){
    //         data.forEach(function(users, index){
    //             $('#users').append(`<option value='${users.id}'>${users.name}</option>`);
    //         });
    //     }
    // });
    
    checkLocalStor();
    if(localStorage.getItem('userId')){
        $('#userName').text(localStorage.getItem('userName'));
        $('#login').hide();
        $('#loginModal').modal('hide');
        $('#logout').show();
        $('input[type="text"]').prop('readonly', false);
        $('button[type="button"]').prop('disabled', false);
        $('select').prop('disabled', false);
    }
});

addTask.addEventListener('click', () => {
    // endData.insertBefore(dataHTML(), endData);
    $(dataHTML()).insertBefore('#endData');
    // insertAfter(lastData, dataHTML());
    $('body').on('focus',".date", function(){
        $(this).datepicker();
    });
});

// $('#login').on('click', function(){
//     $(this).hide();
//     $('#logout').show();
// });
$('#logout').on('click', function(){
    $(this).hide();
    $('#login').show();
})

var breakCount;
(localStorage.getItem('breakCount')) ? breakCount = localStorage.getItem('breakCount') : breakCount = 0;
var breakObj = {};
takeBreak.addEventListener('click', ()=> {
    var breakStart = document.getElementById('breakStart');
    
    $('input[type="text"]').prop('readonly', true);
    $('button[type="button"]').prop('disabled', true);
    $('select').prop('disabled', true);
    $("input").prop('disabled', true);
    takeBreak.style.display = "none";
    backFromBreak.style.display = "inline-block";
    breakStart.innerHTML = time();
    breakCount++;
    breakObj.breakIn = breakStart.innerHTML;
});

backFromBreak.addEventListener('click', ()=> {
    var breakStart = document.getElementById('breakStart');
    var totalBreak = document.getElementById('totalBreak');
    var breakEnd = document.getElementById('breakEnd');
    $('input[type="text"]').prop('readonly', false);
    $('button[type="button"]').prop('disabled', false);
    $('select').prop('disabled', false);
    $("input").prop('disabled', false);
    takeBreak.style.display = "inline-block";
    backFromBreak.style.display = "none";
    breakEnd.innerHTML = time();
    var breakIn = convertTime(breakStart.innerHTML);
    var breakOut = convertTime(breakEnd.innerHTML);
    var totalBreakHours = breakOut - breakIn;
    totalBreak.innerHTML = convertedSeconds(totalBreakHours);
    insertAfter(breakData, breakHTML());

    var allBreaks = 0;
    let numHandler = 0;
    $('.total-break').each(function(){
        if($(this).text()){
            numHandler = convertTime($(this).text());
        } else {
            numHandler = 0;
        }
        allBreaks += numHandler;
    });
    $('#allBreaks').html(convertedSeconds(allBreaks));
    breakObj.breakOut = breakEnd.innerHTML;
    breakObj.breakTotal = totalBreak.innerHTML;
    localStorage.setItem(`break${breakCount}`, JSON.stringify(breakObj));
    localStorage.setItem('allBreaks', convertedSeconds(allBreaks));
    localStorage.setItem('breakCount', breakCount);
});

let taskArray = [];
var timer;
var projects = document.getElementById('projectsData');
var timeId;
var lastData = document.getElementById('lastData');
var projCount = 1;

document.addEventListener('click', (e) => {
    e.preventDefault();

    let str = e.target.id;
    timeId = str.replace( /^\D+/g, '');
    var count = 1;

    let clockin = str.indexOf('clockin');
    let clockout = str.indexOf('clockout');
    let tasks = str.indexOf('task');

    var task = document.getElementById(`task${timeId}`);
    var priority = document.getElementById(`priority${timeId}`);
    var duedate = document.getElementById(`duedate${timeId}`);
    var techlvl = document.getElementById(`techlvl${timeId}`);
    var completion = document.getElementById(`completion${timeId}`);
    var estHr = document.getElementById(`esthr${timeId}`);
    var clockIns = document.getElementById(`clockin${timeId}`);
    var clockOuts = document.getElementById(`clockout${timeId}`);

    if(clockin > -1 && e.target.readOnly == false){
        let clockoutValue = document.getElementById(`clockout${timeId}`);

        clockoutValue.readOnly = false;
        clockoutValue.style.background = "#fff";
        e.target.setAttribute('value', time());
        e.target.readOnly = true;
        const allProj = document.querySelectorAll('.proj');
        var projObj = {};
        // console.log(Object.entries(localStorage));
        if(taskArray.includes(task.value)){

            count++;

            allProj.forEach(function(elmnt, index){
                if(elmnt.value == task.value){
                    var projStor = JSON.parse(localStorage.getItem(elmnt.parentElement.id));
                    projStor.projQuant = count;
                    localStorage.setItem(elmnt.parentElement.id, JSON.stringify(projStor));
                    elmnt.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = count;
                }
            });
        } else {
            count = 1;
            projObj.projectTitle = task.value;
            projObj.projQuant = count;
            
            localStorage.setItem(`project${projCount}`, JSON.stringify(projObj));
            localStorage.setItem('projectCount', projCount);
            insertAfter(projects, projectHTML(task.value, count, projCount));   
            projCount++;
        } 
        taskArray.push(task.value);
        displayModal(task.value);
        halfAlert(task.value);
        
        var milliseconds = convertTime(decTohhmm(estHr.value)) * 1000;

        timer = setTimeout(() => {
            var noExtend = document.getElementById('noExtend');
            // var yesExtend = document.getElementById('yesExtend');
            $('#alertModal').modal();

            noExtend.addEventListener('click', ()=>{
                $('#alertModal').modal('hide');
                if(clockoutValue.value == ""){
                    var actHr = document.getElementById(`acthr${timeId}`);
                    clockOut(timeId, clockoutValue);
                    var taskObj = {
                        task: task.value,
                        priority: priority.value,
                        duedate: duedate.value,
                        techlvl: techlvl.value,
                        completion: completion.value,
                        estHr: estHr.value,
                        actHr: actHr.value,
                        clockIn: clockIns.value,
                        clockOut: clockOuts.value
                    }
                    localStorage.setItem(`task${timeId}`, JSON.stringify(taskObj));
                }
            });
            
            notifSound('./assets/notif.wav');
        }, milliseconds);
        
        halftimer = setTimeout(() => {
            $('#halfAlert').modal();
            notifSound('./assets/notif.wav');
        }, 1800000);

        localStorage.setItem('taskId', timeId);
        
    }
    
    if(clockout > -1 && e.target.readOnly == false){
        var actHr = document.getElementById(`acthr${timeId}`);
        clearTimeout(timer);
        clearTimeout(halftimer);
        clockOut(timeId, e.target);
        $(e.target).parent().prev().prev().prev().children().attr('disabled', true);

        var taskObj = {
            task: task.value,
            priority: priority.value,
            duedate: duedate.value,
            techlvl: techlvl.value,
            completion: completion.value,
            estHr: estHr.value,
            actHr: actHr.value,
            clockIn: clockIns.value,
            clockOut: clockOuts.value
        }
        localStorage.setItem(`task${timeId}`, JSON.stringify(taskObj));
    }

    if(e.target.classList.contains('delt')){
        var taskCount = localStorage.getItem('taskId');
        taskCount--;
        (taskCount > 0) ? localStorage.setItem('taskId', taskCount) : localStorage.removeItem('taskId');
        $(e.target).parent().parent().remove();
        localStorage.removeItem($(e.target).parent().parent().children(':first-child').children(':first-child').attr('id'));
        id--; 
    }

    if(e.target.classList.contains('delt-proj')){
        var projLocCount = localStorage.getItem('projectCount');
        projLocCount--;
        (projLocCount > 0) ? localStorage.setItem('projectCount', projLocCount) : localStorage.removeItem('projectCount');

        $(e.target).parent().parent().remove();
        localStorage.removeItem($(e.target).parent().parent().children(':first-child').attr('id'));
    }

});


$('#addProj').click(function(){
    count = 1;
    var elId = projects.nextElementSibling.firstElementChild.id;
    var numId;
    if(elId){
        numId = parseInt(elId.replace( /^\D+/g, '')) + 1;
    } else {
        numId = 1;
    }
    insertAfter(projects, projectHTML('', count, numId));    
});

$('#sendBtn').on('click', function(){
    reviewModal();
    var dateNeeded = $('#getDate').val();
    $.ajax({
        url: "http://127.0.0.1:8080/http://127.0.0.1:8000/send_review",
        data: {
            dateNeeded
        },
        success: function(data){
            $('#reviewModal').modal();
        }
    });
});

function checkLocalStor(){
    taskLocal();
    breakLocal();
    projectLocal();
}

function projectLocal(){
    var projectCount = localStorage.getItem('projectCount');

    for(let i = 1; i <= projectCount; i++){
        var getProj = JSON.parse(localStorage.getItem(`project${i}`));
        insertAfter(projects, projectHTML(getProj.projectTitle, getProj.projQuant, i)); 
    }
}

function breakLocal(){
    var breakId = localStorage.getItem('breakCount');
    
    for(let i = 1; i <= breakId; i++){
        var getBreak = JSON.parse(localStorage.getItem(`break${i}`));
        $('#breakStart').text(getBreak.breakIn);
        $('#breakEnd').text(getBreak.breakOut);
        $('#totalBreak').text(getBreak.breakTotal);
        insertAfter(breakData, breakHTML());
    }
    $('#allBreaks').text(localStorage.getItem('allBreaks'));
}

function taskLocal(){
    if(localStorage.getItem('taskId') > 5){
        for(let i = localStorage.getItem('taskId'); i > 5; i--){
            $(dataHTML()).insertBefore('#endData');
        }
    }

    for(let i = 1; i <= localStorage.getItem('taskId'); i++){
        var getTask = JSON.parse(localStorage.getItem(`task${i}`));
        var taskLoc = document.getElementById(`task${i}`);
        var priorityLoc = document.getElementById(`priority${i}`);
        var dueDateLoc = document.getElementById(`duedate${i}`);
        var techlvlLoc = document.getElementById(`techlvl${i}`);
        var completionLoc = document.getElementById(`completion${i}`);
        var estHrLoc = document.getElementById(`esthr${i}`);
        var actHrLoc = document.getElementById(`acthr${i}`);
        var clockInLoc = document.getElementById(`clockin${i}`);
        var clockOutLoc = document.getElementById(`clockout${i}`);

        taskLoc.value = getTask.task;
        priorityLoc.value = getTask.priority;
        dueDateLoc.value = getTask.duedate;
        techlvlLoc.value = getTask.techlvl;
        completionLoc.value = getTask.completion;
        estHrLoc.value = getTask.estHr;
        actHrLoc.value = getTask.actHr;
        clockInLoc.value = getTask.clockIn;
        clockOutLoc.value = getTask.clockOut;
        clockInLoc.readOnly = true;
        clockOutLoc.readOnly = true;
        $(`#clockout${i}`).removeAttr('style');
        $(`#clockin${i+1}`).removeAttr('readonly');
        $(`#clockin${i+1}`).removeAttr('style');
    }
}

function dup(arr) {
    arr.sort();
    console.log(arr);
    var current = null;
    var cnt = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != current) {
            if (cnt > 0) {
                return cnt;
            }
            current = arr[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
}

function notifSound(url){
    const audio = new Audio(url);
    audio.play();
}

function loginModal(){
    $('.modal-container').append(`
        <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Login via Skype</h5>
                </div>
                <div class="modal-body">
                    <img src="https://logodownload.org/wp-content/uploads/2017/05/skype-logo-1.png" height="200" style ="margin: 50px;">
                    
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary m-2" id="login" style="width: 100%">Login</button>
                </div>
            </div>
            </div>
        </div>
    `);
}

function displayModal(title, id){
    const mod = document.querySelector('.modal-container');
    const modalHTML = `
        <div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">Time's Up</h5>
				</div>
				<div class="modal-body">
                    Your time is up for Task: ${title}. Do you want to extend?
				</div>
				<div class="modal-footer">
				<button type="button" class="btn btn-danger" id="noExtend" data-id="${id}">No</button>
				<button type="button" class="btn btn-success" data-dismiss="modal">Yes</button>
				</div>
			</div>
			</div>
		</div>
    `;

    mod.innerHTML = modalHTML;
    return mod;    
}

function successModal(){
    $('.modal-container').append(`
        <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Scorecard Sent</h5>
                </div>
                <div class="modal-body">
                    Successfully submitted the scorecard.
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
    `);
}

function reviewModal(){
    $('.modal-container').append(`
        <div class="modal fade" id="reviewModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Review Request Sent</h5>
                </div>
                <div class="modal-body">
                    Successfully notified admin for review.
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
    `);
}

function errorPrevScor(){
    $('.modal-container').append(`
        <div class="modal fade" id="errorPrevScorModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Error</h5>
                </div>
                <div class="modal-body">
                    No Scorecard was fetched.
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
    `);
}

function halfAlert(title, id){
    $('.modal-container').append(
        `<div class="modal fade" id="halfAlert" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Reminder</h5>
                </div>
                <div class="modal-body">
                    Just a reminder about your task: ${title}. Thank you!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
    `); 
}

function clockOut(timeId, target){
    let clockinTime = document.getElementById(`clockin${timeId}`);
    let actualTime = document.getElementById(`acthr${timeId}`);
    let nextClockinTime = document.getElementById(`clockin${++timeId}`);
    let clockinValue = clockinTime.value;

    if(clockinValue != ""){
        target.value = time();
        target.readOnly = true;
        if(nextClockinTime){
            nextClockinTime.readOnly = false;
            nextClockinTime.style.background = "#fff";
        }
        var timein = convertTime(clockinValue);
        var timeout = convertTime(target.value);
        var totalhours = timeout - timein;
        actualTime.setAttribute('value', convertedSeconds(totalhours));
        computedTotal += totalhours;
        
        totalhrs.setAttribute('value', convertedSeconds(computedTotal));
    }
}

function stringToInt(str){
    return parseInt(str);
}

function convertedSeconds(time){
    return new Date(time * 1000).toISOString().substr(11, 8);
}

function timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    var totalTime = hours + minutes / 60;
    return totalTime.toFixed(2);
}

function decTohhmm(hours){
    var sign = hours < 0 ? "-" : "";
    var hr = Math.floor(Math.abs(hours));
    // var min = Math.floor(Math.abs(hours) * 60);
    var min = Math.floor((Math.abs(hours) * 60) % 60);
    return sign + (hr < 10 ? "0" : "") + hr + ":" + (min < 10 ? "0" : "") + min + ":00                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   "; 
}

const roundOff = (number, decimalPlaces) => {
    const factorOfTen = Math.pow(10, decimalPlaces)
    return Math.round(number * factorOfTen) / factorOfTen
}

function convertTime(hms){
    var a = hms.split(':'); // split it at the colons
    
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    
    return seconds;
}    

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
  
function time() {
    var date = new Date();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();

    // adding 0 for single digits

    mm = checkTime(mm);
    ss = checkTime(ss);
  return hh + ":" + mm + ":" + ss;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


function projectHTML(title, counter, id){
    const tr = document.createElement('tr');
    tr.style.height = '15pt';
    const projecthtml = `
        <td class='ee184' style='height:16pt;' id='project${id}'><input type="text" class="proj form-control" value="${title}"></td>
        <td class='ee187' style='height:16pt;'>&nbsp;</td>
        <td class='ee187' style='height:16pt;'>&nbsp;</td>
        <td class='ee137' style='height:16pt;'>&nbsp;</td>
        <td class='ee137' style='height:16pt;'>&nbsp;</td>
        <td class='ee188' style='height:16pt;'>&nbsp;</td>
        <td class='ee190' style='height:16pt;'>&nbsp;</td>
        <td class='proj-count ee192' style='height:16pt;'>${counter}</td>
        <td class='ee109' style='height:16pt;'>
            <button class="delt-proj btn btn-danger">
                <i class="fas fa-backspace"></i>
            </button>
        </td>
        <td class='ee109' style='height:16pt;'>&nbsp;</td>
        <td class='ee109' style='height:16pt;'>&nbsp;</td>
        <td class='ee109' style='height:16pt;'>&nbsp;</td>
        <td class='ee109' style='height:16pt;'>&nbsp;</td>
    `;

    tr.innerHTML = projecthtml;

    return tr;
}

function breakHTML(){
    //Redeclare variables to get new elements with sets of id's
    var breakData = document.getElementById('breakData');
    var breakStart = document.getElementById('breakStart');
    var breakEnd = document.getElementById('breakEnd');
    var totalBreak = document.getElementById('totalBreak');

    //Remove id's from the fetched elements 
    breakData.removeAttribute('id');
    breakStart.removeAttribute('id');
    breakEnd.removeAttribute('id');
    totalBreak.removeAttribute('id');
    const tr = document.createElement('tr');
    tr.style.height = '16pt';
    tr.setAttribute('id', 'breakData');
    const breakHtmlData = `
        <td class='ee175' style='height:15pt; background-color: #c00000; color: #fff;'>
            
        </td>
        <td class='ee175 break-start' style='height:15pt;background-color: #c00000; color: #fff; text-align: center;' colspan = '3' id="breakStart"></td>
        <td class='ee175 break-end' style='height:15pt;background-color: #c00000; color: #fff; text-align: center;' colspan = '3' id="breakEnd"></td>
        <td class='ee175 total-break' style='height:15pt;background-color: #c00000; color: #fff ;' id="totalBreak"></td>
        
        <td class='ee109' style='height:15pt;'>&nbsp;</td>
        <td class='ee109' style='height:15pt;'>&nbsp;</td>
        <td class='ee109' style='height:15pt;'>&nbsp;</td>
    `;
    
    tr.innerHTML = breakHtmlData;
    
    return tr;
}

function dataHTML(){
    id++;
    tabIndex += 8;
    dataRow++;
    const tr = document.createElement('tr');
    tr.style.height = '15pt';
    const htmlData =`
        <td class='ee128' style='height:15pt;'>
            <input id=task${id} type='text' value='' class='ee130 form-control task' style='width:100%' onchange="recalc_onclick(task${id})" name=task${id} placeholder='Task Title' tabindex='27' data-sheet='1' data-row='6' data-col='1'/>
        </td>
        <td class='ee152' style='height:15pt;'>
            <fieldset id='FS1$priority${id}' style='border:0;padding:0;'>
                <select name=priority${id} id=priority${id} class='ee132 form-control priority' style=' width:100% ; padding-left:4px; padding-right:2px;' tabindex='28' onchange="recalc_onclick(\`priority${id}\`)" size='1' data-sheet='1' data-row='6' data-col='2'>
                    <option  data-value='n:1' >1</option>
                    <option  data-value='n:2' >2</option>
                    <option  data-value='n:3' selected >3</option>
                </select>
            </fieldset>
        </td>
        <td class='ee133' style='height:15pt;'>
                <div id=cal_duedate${id} class='input-group date ee132' style='min-width: 9em;'>
                    <input id=duedate${id} name=duedate${id} class='form-control due-date' size='16' type='text' data-widgettype='datepicker' data-caltype='button' tabindex=${tabIndex} data-sheet='1' data-row='${dataRow}' data-col='3'>
                    <span class='input-group-addon add-on'>
                        <i class='glyphicon glyphicon-calendar'></i> 
                    </span>
                </div>
        </td>
        <td class='ee152' style='height:15pt;'>
            <fieldset id='FS1$techlvl${id}' style='border:0;padding:0;'>
                <select name=techlvl${id} id=techlvl${id} class='ee132 form-control tech-level' style=' width:100% ; padding-left:4px; padding-right:2px;' tabindex='30' onchange="recalc_onclick(\`techlvl${id}\`)" size='1' data-sheet='1' data-row='6' data-col='4'>
                    <option  data-value='n:1' selected >1</option>
                    <option  data-value='n:2' >2</option>
                    <option  data-value='n:3' >3</option>
                    <option  data-value='n:4' >4</option>
                    <option  data-value='n:5' >5</option>
                </select>
            </fieldset>
        </td>
        <td class='ee134' style='height:15pt;'>
            <input id=completion${id} type='text' value='0%' class='ee136 form-control completion' style='width:100%' onchange="this.value=eedisplayPercentND(eeparsePercent(this.value),0);recalc_onclick(\`completion${id}\`)" name=\`completion${id}\` placeholder='' tabindex='31' data-sheet='1' data-row='6' data-col='5'/>
        </td>
        <td class='ee152' style='height:15pt;'>
            <input id=esthr${id} type='text' value='0.00' class='ee136 form-control estimated-hr' style='width:100%' onchange="this.value=eedisplayFloatND(eeparseFloat(this.value),2);recalc_onclick(\`esthr${id}\`')" name=\`esthr${id}\`' placeholder='' tabindex='32' data-sheet='1' data-row='6' data-col='6'/>
        </td>
        <td class='ee137' style='height:15pt;'>
            <input id=acthr${id} type='text' readonly='readonly' value='' class='form-control actual-hr' name=acthr${id}/>
        </td>
        <td class='ee139' style='height:15pt;'>
            <button class="delt btn btn-danger" style="background-color: #000!important; width: 100%">
                <i class="fas fa-minus-circle"></i>
            </button>
        </td>
        <td class='ee118' style='height:15pt;'>&nbsp;</td>
        <td class='ee142' style='height:15pt;'>
            <input class="form-control clockin" type="text" id="clockin${id}" readonly autocomplete="off" style="background: transparent;">
        </td>
        <td class='ee142' style='height:15pt;'>
            <input class="form-control clockout" type="text" id="clockout${id}" readonly autocomplete="off" style="background: transparent;">
        </td>
        <td class='ee109' style='height:15pt;'>&nbsp;</td>
        <td class='ee109' style='height:15pt;'>&nbsp;</td>
        <td class='ee109' style='height:15pt;'>&nbsp;</td>
        <td class='ee109' style='height:15pt;'>&nbsp;</td>`;
    tr.innerHTML = htmlData;
    return tr;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}