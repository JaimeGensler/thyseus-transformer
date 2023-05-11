(function(s,t){typeof exports=="object"&&typeof module<"u"?t(exports,require("typescript")):typeof define=="function"&&define.amd?define(["exports","typescript"],t):(s=typeof globalThis<"u"?globalThis:s||self,t(s.thyseus_ts_transformer={},s.ts))})(this,function(s,t){"use strict";const f=[];function g(e){f.push(e)}function N(e){const r=[e,...f];return f.length=0,t.factory.createNodeArray(r)}const p=new Map;function S(e,r){p.has(e)||p.set(e,new Set),p.get(e).add(r)}function T(e){const r=[],i=new Set;for(const a of e.statements)t.isImportDeclaration(a)&&i.add(a.moduleSpecifier.getText(e)),r.push(a);for(const[a,o]of p){const n=Array.from(o,c=>t.factory.createImportSpecifier(!1,void 0,t.factory.createIdentifier(c)));if(!i.has(`'${a}'`))r.unshift(t.factory.createImportDeclaration(void 0,t.factory.createImportClause(!1,void 0,t.factory.createNamedImports(n)),t.factory.createStringLiteral(a,!0)));else{const c=r.findIndex(u=>t.isImportDeclaration(u)&&u.moduleSpecifier.getText(e)===`'${a}'`),m=r[c],F=[...((m.importClause?.namedBindings).elements??[]).filter(u=>!o.has(u.name.getText())),...n],A=t.factory.updateImportClause(m.importClause,!1,void 0,t.factory.createNamedImports(F));r[c]=t.factory.updateImportDeclaration(m,m.modifiers,A,m.moduleSpecifier,m.assertClause)}}return p.clear(),t.factory.updateSourceFile(e,r)}const l={Query:{descriptorName:"QueryDescriptor",importPath:"thyseus"},Res:{descriptorName:"ResourceDescriptor",importPath:"thyseus"},Commands:{descriptorName:"CommandsDescriptor",importPath:"thyseus"},World:{descriptorName:"WorldDescriptor",importPath:"thyseus"},SystemRes:{descriptorName:"SystemResourceDescriptor",importPath:"thyseus"},EventReader:{descriptorName:"EventReaderDescriptor",importPath:"thyseus"},EventWriter:{descriptorName:"EventWriterDescriptor",importPath:"thyseus"},Mut:{descriptorName:"Mut",importPath:"thyseus"},With:{descriptorName:"With",importPath:"thyseus"},Without:{descriptorName:"Without",importPath:"thyseus"},Or:{descriptorName:"Or",importPath:"thyseus"},Optional:{descriptorName:"Optional",importPath:"thyseus"}};function I(e){return x(e)&&g(t.factory.createExpressionStatement(t.factory.createAssignment(t.factory.createPropertyAccessExpression(e.name,"parameters"),t.factory.createArrayLiteralExpression(y(e).parameters.map(r=>d(r.type)))))),e}function x(e){if(!(t.isFunctionDeclaration(e)||t.isVariableDeclaration(e)&&e.initializer&&(t.isArrowFunction(e.initializer)||t.isFunctionExpression(e.initializer))))return!1;const i=y(e);return!!e.name&&i.parameters.length>0&&i.parameters.every(D)}function y(e){return t.isFunctionDeclaration(e)?e:e.initializer}function D(e){return!!e.type&&h(e.type)in l}function d(e){if(t.isTypeReferenceNode(e)){const r=h(e),i=l[r];return i?(S(i.importPath,i.descriptorName),t.factory.createCallExpression(t.factory.createIdentifier(i.descriptorName),void 0,e.typeArguments?.map(d)??[])):t.factory.createIdentifier(r)}else return t.isTupleTypeNode(e)?t.factory.createArrayLiteralExpression(e.elements.map(d)):t.factory.createIdentifier(e.getText())}function h(e){return t.isTypeReferenceNode(e)?e.typeName.getText():e.getText()}const P="thyseus-ignore";function v(e){if(t.isSourceFile(e))return!1;const r=t.getLeadingCommentRanges(e.getFullText(),0)??[];for(const{kind:i,pos:a,end:o}of r)if((i===t.SyntaxKind.SingleLineCommentTrivia||i===t.SyntaxKind.MultiLineCommentTrivia)&&e.getFullText().substring(a,o).includes(P))return!0;return!1}function C(e){return r=>i=>{function a(o){if(v(o))return o;const n=t.visitEachChild(I(o),a,r);return t.isStatement(n)?N(n):n}return T(t.visitNode(i,a))}}function E(e){const r=t.createPrinter();return function(a){t.createProgram([""],{});const o=C(),n=t.createSourceFile("",a,t.ScriptTarget.Latest,!0,t.ScriptKind.TS|t.ScriptKind.TSX),{transformed:c}=t.transform(n,[o]);return r.printFile(c[0])}}s.getTransformer=E,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})});