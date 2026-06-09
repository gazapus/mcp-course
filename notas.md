# MCP
[link documentación](https://modelcontextprotocol.io/docs/getting-started/intro)

## Arquitectura:
Cada MCP tiene HOST(Cliente) y Servidores.

Los servidores son procesos ligeros que responden a las solicitudes de los MCP Clientes y también se pueden comunicar con los clientes, es bidireccional. Cada servidor tendrá una sola responsabilidad. 

Los HOST pueden tener varios clientes MCP.
Cada servidor debe tener una sola responsabilidad. 

Los servidores saben como concetarse a una API, BD, sistema de archivos, etc. Son especialistas en su tarea para poder traducir los pedidos del usuario mediante el MCP Cliente 

## Protocolo JSON RCP 2
Las peticiones y respuestas deben seguir el mismo formato, este es JSON RPC 2.0.
Tendrá tres miembros las solicitudes: 
- id: identificador de comunicación 
- method: acción que se está pidiendo al mcp
- params: objeto o array de valores que se pasan como parametros.
- jsonrpc: versión de jsonrpc

Las respuestas:
- id:
- result:
- error:

Mensajes de notificación: (servidor alcliente):
- jsonrpc
- method
- params

## Transporte
Hay dos estandares de transporte para MCP

### Standard input/output
Es el estandar que usan los programas de consola para recibir y mostrar datos por consola.

Esto es así porque la comunicación va a usar los MCP como programas de consola. 

### Server Sent Events
Se mantiene una conexión abierta todo el tiempo mediante un streaming. Durante este periodo el Servidor puede enviar todo el tiempo información al cliente. Esto es unidireccional.

Para que el cliente pueda enviar mensajes al servidor lo debe hacer mediante un endpoint REST tradicional. Pero actualmente existe la forma de usar REST tradicional para enviar y recibir información en MCP.

## Ciclo de Vida

El cliente realiza un request de inicializción al servidor. 
El servidor responde y le da los accesos que corresponda. Ademas le dice que recursos le ofrece al cliente para que el cliente conozca qué puede hacer. 
El cliente le envía una notificación indicando la conexión activa. 
Una vez hecho la conexión queda lista para usarse.
Terminación: Mensaje de finalización de la conexión que cualqueir parte puede enviarlo.

### Caracteristiscas de servidor:
- **Ofrecer recursos**: Expone datos y contenido del servidor, como achivos, respuestas de bd, api, etc. Para esto utiliza *URIS* como identificadores de recursos. Estos tipos de recursos pueden ser de texto o binarios (como imagenes, pdf, videos, etc). 
El cliente puede solicitar al servidor el listado de recursos. Por ejemolo mediante resource/list y el servidor responde algo como 
``` {
    uri: string,
    name: string,
    description: string
    mimeType: string
}
```
El cliente puede solicitar los recursos asi: ```resource/read```
El servidor responde algo así
```
{
    contents:[
        {
            uri: string
            mimeType: string
            text: string
            blob: string //para binario
        }
    ]
}
```
También existe la forma de que el servidor notifique al cliente sobre cambios en los recursos.

- **Ofrecer PROMPTS**:
El cliente puede solicitar el listado de prompts que ofrece el servidor: 
``` 
prompts/list
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/list",
  "params": {
    "cursor": "optional-cursor-value"
  }
}
```
Respeusta:
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "prompts": [
      {
        "name": "code_review",
        "title": "Request Code Review",
        "description": "Asks the LLM to analyze code quality and suggest improvements",
        "arguments": [
          {
            "name": "code",
            "description": "The code to review",
            "required": true
          }
        ]
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}
```

¿Como usa el cliente ese prompt?
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {
      "code": "def hello():\n    print('world')"
    }
  }
}
```
¿Qué devuelve el servidor? Un prompt personalizado para que el cliente lo ejecute en su LLM. 
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "description": "Code review prompt",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review this Python code:\ndef hello():\n    print('world')"
        }
      }
    ]
  }
}
```

- **Tools**
https://modelcontextprotocol.io/specification/2025-11-25/server/tools
Permite a los LLM que realicen acciones en un servidor, como consultar una base de datos o API. 
- Utiliza el request tools/list para obtener el listado de tools del servidor
- Para ejecutar usa tools/call para ejeuctarlas. 

Ejemplo de call a tool:
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "New York"
    }
  }
}
```
Ejemplo de respuesta:
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in New York:\nTemperature: 72°F\nConditions: Partly cloudy"
      }
    ],
    "isError": false
  }
}
```
Las tools definen input schema y output para el formato de las solicitudes y respuestas. 

## CLIENTES
### Sampling:
https://modelcontextprotocol.io/seps/2577-deprecate-roots-sampling-and-logging#sampling
Le permite al servidor hacerle preguntas al LLM Cliente. 
El servidor le hace un request al cliente con sampling/createMessage. El cliente le hace la pregunta al LLM y retorna el resutlado al servidor. Esto es peligroso porque el servidor puede hacer preguntas maliciosas o demasiadas al cliente.

### Roots:
Le dice al cliente sobre que directorios puede operar

## CREAR NUESTRO MCP CLIENT:
Ver ejemplo de basic un servers mcp.

Usamos esta herramienta, La cual es MCP INSPECTOR, de npm para probar los mcp que creamos. Probamos sus transportes, comandso, respuestas, etc:
```
npx @modelcontextprotocol/inspector 
```
https://modelcontextprotocol.io/docs/tools/inspector#npm-package

Al hacerlo abre una interfaz gráfica en el navegador que simulará ser un cliente MCP que conectara a mi servidor,
Esta interfaz nos permite probar resources, prompts y tools con los que cuente el servidor de MCP.