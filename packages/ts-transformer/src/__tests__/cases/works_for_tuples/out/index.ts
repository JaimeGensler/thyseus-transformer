import { QueryDescriptor } from 'thyseus';
function querySystem(query: Query<[
    A,
    B
]>) { }
querySystem.parameters = [QueryDescriptor([A, B])];
