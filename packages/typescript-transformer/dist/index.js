import e from "typescript";
const p = /* @__PURE__ */ new Map();
let o = 0;
function S(t) {
  e.isStatement(t) && o++;
}
function x(t) {
  p.has(o) || p.set(o, []), p.get(o).push(t);
}
function I(t) {
  if (!e.isStatement(t))
    return t;
  const r = p.get(o) ?? [];
  return p.delete(o), o--, r.length === 0 ? t : e.factory.createNodeArray([t, ...r]);
}
const u = /* @__PURE__ */ new Map();
function T(t, r) {
  u.has(t) || u.set(t, /* @__PURE__ */ new Set()), u.get(t).add(r);
}
function D(t) {
  const r = [], i = /* @__PURE__ */ new Set();
  for (const s of t.statements)
    e.isImportDeclaration(s) && i.add(s.moduleSpecifier.getText(t)), r.push(s);
  for (const [s, a] of u) {
    const n = Array.from(
      a,
      (c) => e.factory.createImportSpecifier(
        !1,
        void 0,
        e.factory.createIdentifier(c)
      )
    );
    if (!i.has(`'${s}'`))
      r.unshift(
        e.factory.createImportDeclaration(
          void 0,
          e.factory.createImportClause(
            !1,
            void 0,
            e.factory.createNamedImports(n)
          ),
          e.factory.createStringLiteral(s, !0)
        )
      );
    else {
      const c = r.findIndex(
        (f) => e.isImportDeclaration(f) && f.moduleSpecifier.getText(t) === `'${s}'`
      ), m = r[c], g = [
        ...((m.importClause?.namedBindings).elements ?? []).filter(
          (f) => !a.has(f.name.getText())
        ),
        ...n
      ], N = e.factory.updateImportClause(
        m.importClause,
        !1,
        void 0,
        e.factory.createNamedImports(g)
      );
      r[c] = e.factory.updateImportDeclaration(
        m,
        m.modifiers,
        N,
        m.moduleSpecifier,
        m.assertClause
      );
    }
  }
  return u.clear(), e.factory.updateSourceFile(t, r);
}
const y = {
  // Parameters
  Query: {
    descriptorName: "QueryDescriptor",
    importPath: "thyseus"
  },
  Res: {
    descriptorName: "ResourceDescriptor",
    importPath: "thyseus"
  },
  Commands: {
    descriptorName: "CommandsDescriptor",
    importPath: "thyseus"
  },
  World: {
    descriptorName: "WorldDescriptor",
    importPath: "thyseus"
  },
  SystemRes: {
    descriptorName: "SystemResourceDescriptor",
    importPath: "thyseus"
  },
  EventReader: {
    descriptorName: "EventReaderDescriptor",
    importPath: "thyseus"
  },
  EventWriter: {
    descriptorName: "EventWriterDescriptor",
    importPath: "thyseus"
  },
  // Modifiers
  Mut: {
    descriptorName: "Mut",
    importPath: "thyseus"
  },
  With: {
    descriptorName: "With",
    importPath: "thyseus"
  },
  Without: {
    descriptorName: "Without",
    importPath: "thyseus"
  },
  Or: {
    descriptorName: "Or",
    importPath: "thyseus"
  },
  Optional: {
    descriptorName: "Optional",
    importPath: "thyseus"
  }
};
function P(t) {
  return C(t) && x(
    e.factory.createExpressionStatement(
      e.factory.createAssignment(
        e.factory.createPropertyAccessExpression(
          t.name,
          "parameters"
        ),
        e.factory.createArrayLiteralExpression(
          d(t).parameters.map(
            (r) => l(r.type)
          )
        )
      )
    )
  ), t;
}
function C(t) {
  if (!(e.isFunctionDeclaration(t) || e.isVariableDeclaration(t) && t.initializer && (e.isArrowFunction(t.initializer) || e.isFunctionExpression(t.initializer))))
    return !1;
  const i = d(t);
  return !!t.name && i.parameters.length > 0 && i.parameters.every(v);
}
function d(t) {
  return e.isFunctionDeclaration(t) ? t : t.initializer;
}
function v(t) {
  return !!t.type && h(t.type) in y;
}
function l(t) {
  if (e.isTypeReferenceNode(t)) {
    const r = h(t), i = y[r];
    return i ? (T(i.importPath, i.descriptorName), e.factory.createCallExpression(
      e.factory.createIdentifier(i.descriptorName),
      void 0,
      t.typeArguments?.map(l) ?? []
    )) : e.factory.createIdentifier(r);
  } else
    return e.isTupleTypeNode(t) ? e.factory.createArrayLiteralExpression(
      t.elements.map(l)
    ) : e.factory.createIdentifier(t.getText());
}
function h(t) {
  return e.isTypeReferenceNode(t) ? t.typeName.getText() : t.getText();
}
const E = "thyseus-ignore";
function F(t) {
  if (e.isSourceFile(t))
    return !1;
  const r = e.getLeadingCommentRanges(t.getFullText(), 0) ?? [];
  for (const { kind: i, pos: s, end: a } of r)
    if ((i === e.SyntaxKind.SingleLineCommentTrivia || i === e.SyntaxKind.MultiLineCommentTrivia) && t.getFullText().substring(s, a).includes(E))
      return !0;
  return !1;
}
function A(t) {
  return (r) => (i) => {
    function s(a) {
      if (F(a))
        return a;
      S(a);
      const n = e.visitEachChild(
        P(a),
        s,
        r
      );
      return I(n);
    }
    return D(e.visitNode(i, s));
  };
}
function w(t) {
  const r = e.createPrinter();
  return function(s) {
    e.createProgram([""], {});
    const a = A(), n = e.createSourceFile(
      "",
      s,
      e.ScriptTarget.Latest,
      // Remain unopinionated about output
      !0,
      // Need access to parent nodes from children
      e.ScriptKind.TS | e.ScriptKind.TSX
    ), { transformed: c } = e.transform(n, [a]);
    return r.printFile(c[0]);
  };
}
export {
  w as getTransformer
};
