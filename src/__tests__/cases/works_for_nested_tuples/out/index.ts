import { QueryDescriptor, With } from 'thyseus/descriptors';
function querySystem(query: Query<[
    A,
    B
], With<[
    C,
    D
]>>) { }
querySystem.parameters = [QueryDescriptor([A, B], With([C, D]))];
