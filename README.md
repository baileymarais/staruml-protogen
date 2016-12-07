# StarUML Protogen

This extension generates protocol buffers based on Entity Relationship Diagrams.

## Generator

The generator itself creates a new file / message type for each `Entity` node defined in your data model.

### Type Mapping

| StarUML Type | Protobuf type |
| --- | --- | --- |
| VARCHAR | string|
| BOOLEAN | bool|
|INTEGER|int32|
|CHAR|string|
|BINARY|byte|
|VARBINARY|byte|
|BLOB|byte|
|TEXT|string|
|SMALLINT|int32|
|BIGINT|int64|
|DECIMAL|double|
|NUMERIC|int32|
|FLOAT|float|
|DOUBLE|double|
|BIT|bool|
|DATE|N/A|
|TIME|N/A|
|DATETIME|N/A|
|TIMESTAMPTZ|N/A|
|TIMESTAMP|N/A|
|POINT|N/A|
|POLYGON|N/A|

### Generated Files

An `ERDEntity` with the name `User` will generate a protocol buffer named:

> `User.proto`

### Relationship Mapping

* One-to-many relationships generate protocol buffers where the many `Entity` contains a field of the one `Entity`'s message type.
