<?php
require_once 'Database.php';
class Player extends Database{
    protected $tableName = 'players';
    public function add($data)
    {
        if(!empty($data))
        {
            $fields = $placeholder = [];
            foreach($data as $field=>$value)
            {
                $fields[] =$field;
                $placeholder[]=":{$field}";
            }
        }
        $sql = "INSERT INTO {$this->tableName} (".implode(',',$fields).") VALUES(".implode(',',$placeholder).")";
        $statement = $this->conn->prepare($sql);
        try
        {
            $this->conn->beginTransaction();
            $statement->execute($data);
           
            $lastInsertedId = $this->conn->lastInsertId();
            $this->conn->commit();
            return $lastInsertedId;
        }catch(PDOException $e){
            echo"Error:".$e->getMessage();
            $this->conn->rollback();
        }
    }

    public function update($data,$id){
        if(!empty($data))
        {
            $fields = '';
            $x =1;
            $fieldsCount = count($data);
            foreach($data as $field=>$value)
            {
                $fields .= "{$field}=:{$field}";
                if($x < $fieldsCount){
                    $fields .=",";
                }
                $x++;
            }
        }
        $sql = "UPDATE {$this->tableName} SET {$fields} WHERE id =:id";
        $statement = $this->conn->prepare($sql);
        try
        {
            $this->conn->beginTransaction();
            $data['id'] = $id;
            $statement->execute($data);
            $this->conn->commit();
        }catch(PDOException $e){
            echo"Error:".$e->getMessage();
            $this->conn->rollback();
        }
    }

    public function getRows($start = 0,$limit = 4)
    {
        $sql = "SELECT * FROM {$this->tableName} ORDER BY id DESC LIMIT {$start},{$limit}";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
        if($statement->rowCount() > 0)
        {
            $results = $statement->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $results = [];

        }
        return $results;
    }

    public function getCount()
    {
        
        $sql = "SELECT count(*) as pcount FROM {$this->tableName}";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        
        return $result['pcount'];
    }

    public function getRow($field,$value)
    {
        $sql = "SELECT * FROM {$this->tableName} WHERE {$field}=:{$field}";
        $statement = $this->conn->prepare($sql);
        $statement->execute([":{$field}" =>$value]);

        if($statement->rowCount() > 0)
        {
            $results = $statement->fetch(PDO::FETCH_ASSOC);
        }else{
            $results = [];
        }
        return $results;
    }


    public function deleteRow($id)
    {
        $sql = "DELETE FROM {$this->tableName} WHERE id=:id";
        $statement = $this->conn->prepare($sql);
       

        try{
            $statement->execute([":id" =>$id]);
            if($statement->rowCount() > 0)
            {
            return true;
            }
            }catch(PDOException $e){
                echo"Error:".$e->getMessage();
            return false;
        }
        
       
    }

    public function uploadPhoto($file)
    {
        if(!empty($file))
        {
            $fileTempPath = $file['tmp_name'];
            $fileName = $file['name'];
            $fileSize = $file['size'];
            $fileType = $file['type'];
            $fileNameCmps = explode('.',$fileName);
            $fileExtension = strtolower(end($fileNameCmps));
            $newFileName = md5(time().$fileName) . '.' . $fileExtension;
            $allowedExtn = ["jpg","png","gif","jpeg"];

            if(in_array($fileExtension,$allowedExtn)){
                $uploadFileDir = getcwd().'/uploads/';
                $destFilePath = $uploadFileDir . $newFileName;
                if(move_uploaded_file($fileTempPath,$destFilePath)){
                    return $newFileName;
                }
            }
        }
    }

    
}
    
?>