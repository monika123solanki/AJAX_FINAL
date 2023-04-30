//get pagination
function pagination(totalpages,currentpage){
    let pagelist ='';
    if(totalpages >1)
    {
       
        currentpage = parseInt(currentpage);
        pagelist +=`<ul class="pagination justify-content-center">`;
        const previousClass = currentpage == 1 ? "disabled" : "";
        pagelist +=`<li class="page-item ${previousClass}"><a class="page-link" href="#" data-page="${currentpage - 1}">Previous</a></li>`;
        for(let p=1; p<=totalpages; p++){
            const activeClass = currentpage == p ? "active" : "";
            pagelist +=`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
        }
        
        const nextClass = currentpage == totalpages ? "disabled" : "";
        pagelist +=`<li class="page-item${nextClass}"><a class="page-link" href="#" data-page="${currentpage + 1}">Next</a></li>`;
        pagelist +=`</ul>`;

    }
    $('#pagination').html(pagelist);
}

//get player row
function getplayerrow(player){
    let playerRow = '';
    if(player){
        playerRow =`<tr>
        <td class="align-middle">
          <img src="uploads/${player.photo}" class="img-thumbnail rounded float-left">
        </td>
        <td class="align-middle">
            ${player.name}
        </td>
        <td class="align-middle">
            ${player.email}
        </td>
        <td class="align-middle">
            ${player.phone}
        </td>
        <td class="align-middle">
          <a href="#" class="btn btn-success mr-3 profile" data-toggle="modal" data-target="#userViewModal" title="Prfile" data-id="${player.id}"><i class="fa fa-address-card-o" aria-hidden="true"></i></a>
          <a href="#" class="btn btn-warning mr-3 edituser" data-toggle="modal" data-target="#userModal" title="Edit" data-id="${player.id}"><i class="fa fa-pencil-square-o fa-lg"></i></a>
          <a href="#" class="btn btn-danger deleteuser" data-userid="14" title="Delete" data-id="${player.id}"><i class="fa fa-trash-o fa-lg"></i></a>
        </td>
      </tr>`;
    }
    return playerRow;
}

// get playerlist
function getplayers(){
    let pageno = $('#currentpage').val();
    $.ajax({
        url:"/ajax_crud_simple-main/ajax.php",
        type:"GET",
        dataType:"json",
        data:{page:pageno, action:"getusers"},
        beforSend:function(){
            $('#overlay').fadeIn();
        },
        success:function(rows){
            console.log(rows);
            if(rows.players){
               
                let playerslist = '';
                $.each(rows.players,function(index,player){
                    playerslist += getplayerrow(player);
                });
                $('#userstable tbody').html(playerslist);
                let totalPlayers = rows.count;
                totalpages = Math.ceil(parseInt(totalPlayers)/4);
                const currentpage = $("#currentpage").val();
                pagination(totalpages,currentpage);
                $('#overlay').fadeOut();
            }
        },
        error:function(){
            console.log("Eroor....");
        }
    });
}

$(document).ready(function(){
// add/edit
$(document).on("submit","#addform",function(event){
    event.preventDefault();
    $.ajax({
        url:"/ajax_crud_simple-main/ajax.php",
        type:"POST",
        dataType:"json",
        data:new FormData(this),
        processData:false,
        contentType:false,
        beforSend:function(){
            $('#overlay').fadeIn();
        },
        success:function(response){
            console.log(response);
            if(response){
                $('#userModal').modal('hide');
                $('#addform')[0].reset();
                getplayers();
                $('#overlay').fadeOut();
            }
        },
        error:function(){
            // console.log("Eroor .....");
        }
    });
});

//pagination
$(document).on("click","ul.pagination li a",function(e){
    e.preventDefault();
    $this = $(this);
    const pagenum = $this.data("page");
    $('#currentpage').val(pagenum);
    getplayers();
    $this.parent().siblings().removeClass("active");
    $this.parent().addClass('active');
});



$(document).on("click","#addnewbtn",function(){
    $("#addform")[0].reset();
    $('#userid'),val("");
});


//get user
$(document).on("click","a.edituser",function(){
    let pid = $(this).data('id');
    $.ajax({
        url:"/ajax_crud_simple-main/ajax.php",
        type:"GET",
        dataType:"json",
        data:{id:pid, action:"getuser"},
        beforSend:function(){
            $('#overlay').fadeIn();
        },
        success:function(player ){
           if(player){
            $('#username').val(player.name);
            $('#email').val(player.email);
            $('#phone').val(player.phone);
            $('#userid').val(player.id);
           }
            $('#overlay').fadeOut();
        },
        error:function(){
            console.log("Eroor....");
        }
    });
});


//delete user

$(document).on("click","a.deleteuser",function(e){
    e,preventDefault();
    let pid = $(this).data('id');
    if(confirm("Are you sure want to delete?")){
        $.ajax({
            url:"/ajax_crud_simple-main/ajax.php",
            type:"GET",
            dataType:"json",
            data:{id:pid, action:"deleteuser"},
            beforSend:function(){
                $('#overlay').fadeIn();
            },
            success:function(res){
                if(res.deleted == 1){
                    getplayers();
                    $('#overlay').fadeOut();
                }
                
                
            },
            error:function(){
                console.log("Eroor....");
            }
        });
    }
   
});

getplayers();
});