import { QueryDescriptor } from 'thyseus/descriptors';
function querySystem(query: Query<[
    A,
    B
]>) { }
querySystem.parameters = [QueryDescriptor([A, B])];
