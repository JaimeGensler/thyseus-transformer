import e from "typescript";
const u = [];
function N(t) {
  u.push(t);
}
function S(t) {
  const r = [t, ...u];
  return u.length = 0, e.factory.createNodeArray(r);
}
const m = /* @__PURE__ */ new Map();
function I(t, r) {
  m.has(t) || m.set(t, /* @__PURE__ */ new Set()), m.get(t).add(r);
}
function T(t) {
  const r = [], i = /* @__PURE__ */ new Set();
  for (const s of t.statements)
    e.isImportDeclaration(s) && i.add(s.moduleSpecifier.getText(t)), r.push(s);
  for (const [s, a] of m) {
    const o = Array.from(
      a,
      (n) => e.factory.createImportSpecifier(
        !1,
        void 0,
        e.factory.createIdentifier(n)
      )
    );
    if (!i.has(`'${s}'`))
      r.unshift(
        e.factory.createImportDeclaration(
          void 0,
          e.factory.createImportClause(
            !1,
            void 0,
            e.factory.createNamedImports(o)
          ),
          e.factory.createStringLiteral(s, !0)
        )
      );
    else {
      const n = r.findIndex(
        (p) => e.isImportDeclaration(p) && p.moduleSpecifier.getText(t) === `'${s}'`
      ), c = r[n], h = [
        ...((c.importClause?.namedBindings).elements ?? []).filter(
          (p) => !a.has(p.name.getText())
        ),
        ...o
      ], g = e.factory.updateImportClause(
        c.importClause,
        !1,
        void 0,
        e.factory.createNamedImports(h)
      );
      r[n] = e.factory.updateImportDeclaration(
        c,
        c.modifiers,
        g,
        c.moduleSpecifier,
        c.assertClause
      );
    }
  }
  return m.clear(), e.factory.updateSourceFile(t, r);
}
const l = {
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
function x(t) {
  return D(t) && N(
    e.factory.createExpressionStatement(
      e.factory.createAssignment(
        e.factory.createPropertyAccessExpression(
          t.name,
          "parameters"
        ),
        e.factory.createArrayLiteralExpression(
          d(t).parameters.map(
            (r) => f(r.type)
          )
        )
      )
    )
  ), t;
}
function D(t) {
  if (!(e.isFunctionDeclaration(t) || e.isVariableDeclaration(t) && t.initializer && (e.isArrowFunction(t.initializer) || e.isFunctionExpression(t.initializer))))
    return !1;
  const i = d(t);
  return !!t.name && i.parameters.length > 0 && i.parameters.every(P);
}
function d(t) {
  return e.isFunctionDeclaration(t) ? t : t.initializer;
}
function P(t) {
  return !!t.type && y(t.type) in l;
}
function f(t) {
  if (e.isTypeReferenceNode(t)) {
    const r = y(t), i = l[r];
    return i ? (I(i.importPath, i.descriptorName), e.factory.createCallExpression(
      e.factory.createIdentifier(i.descriptorName),
      void 0,
      t.typeArguments?.map(f) ?? []
    )) : e.factory.createIdentifier(r);
  } else
    return e.isTupleTypeNode(t) ? e.factory.createArrayLiteralExpression(
      t.elements.map(f)
    ) : e.factory.createIdentifier(t.getText());
}
function y(t) {
  return e.isTypeReferenceNode(t) ? t.typeName.getText() : t.getText();
}
const v = "thyseus-ignore";
function C(t) {
  if (e.isSourceFile(t))
    return !1;
  const r = e.getLeadingCommentRanges(t.getFullText(), 0) ?? [];
  for (const { kind: i, pos: s, end: a } of r)
    if ((i === e.SyntaxKind.SingleLineCommentTrivia || i === e.SyntaxKind.MultiLineCommentTrivia) && t.getFullText().substring(s, a).includes(v))
      return !0;
  return !1;
}
function E(t) {
  return (r) => (i) => {
    function s(a) {
      if (C(a))
        return a;
      const o = e.visitEachChild(
        x(a),
        s,
        r
      );
      return e.isStatement(o) ? S(o) : o;
    }
    return T(e.visitNode(i, s));
  };
}
function R(t) {
  const r = e.createPrinter();
  return function(s) {
    e.createProgram([""], {});
    const a = E(), o = e.createSourceFile(
      "",
      s,
      e.ScriptTarget.Latest,
      // Remain unopinionated about output
      !0,
      // Need access to parent nodes from children
      e.ScriptKind.TS | e.ScriptKind.TSX
    ), { transformed: n } = e.transform(o, [a]);
    return r.printFile(n[0]);
  };
}
export {
  R as getTransformer
};
