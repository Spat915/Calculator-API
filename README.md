# A Simple Calculator API

## Objectives
- Create An API That supports both **GET** and **POST**
- The get and post routes should simply be **/**

### GET

- The get should return a list of calculator operations
  - Operations that should be supported is add, subtract, multiply, divide
- The response schema should be as follows
``` metadata json 
[
    {
        "operation": string
            
    }
]
```    

### POST

- The post will execute the operation and return the result 
  - The operations provided should be one less than the operands 
    - example if we pass in two operations we should only pass in 3 operands
  - If there is any errors return a 500
    - Invalid operation name
    - invalid amount of either operations or operands
- The request Schema should be as follows
``` metadata json
{
  "operations": string[],
  "operands": number[],
}
```
- The response schema should be as follows
```metadata json
    number
```


