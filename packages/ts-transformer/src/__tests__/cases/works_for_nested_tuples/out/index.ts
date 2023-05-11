import { QueryDescriptor, With } from 'thyseus';
function querySystem(query: Query<[
    A,
    B
], With<[
    C,
    D
]>>) { }
querySystem.parameters = [QueryDescriptor([A, B], With([C, D]))];
