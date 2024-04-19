// output/Main/foreign.js
var keysDown = {};
window.addEventListener("keydown", (event) => {
  keysDown[event.key] = true;
});
window.addEventListener("keyup", (event) => {
  keysDown[event.key] = false;
});
function isKeyDown(key) {
  return keysDown[key] || false;
}
if (isKeyDown("ArrowRight")) {
  console.log("Right arrow key is held down!");
}
var getContainer = () => {
  console.log("[getContainer]");
  return document.getElementById("container");
};
var getElement = (id) => () => {
  console.log("[getElement]", JSON.stringify({ id }));
  return document.getElementById(id);
};
var createElement = (label) => (kids) => () => {
  console.log("[createElement]", JSON.stringify({ label }));
  const e = document.createElement("div");
  e.classList.add("node");
  e.id = label;
  const l = document.createElement("div");
  l.classList.add("label");
  l.innerText = label;
  e.appendChild(l);
  kids.forEach((kid) => e.appendChild(kid));
  return e;
};
var addKid = (parent) => (kid) => () => {
  console.log("[addKid]");
  return parent.appendChild(kid);
};
var getParent = (kid) => () => {
  console.log("[getParent]");
  return kid.parentElement;
};
var replaceKid = (parent) => (args) => () => {
  console.log("[replaceKid]");
  return parent.replaceChild(args.new, args.old);
};
var createButton = ({ label, onclick }) => () => {
  const e = document.createElement("button");
  e.classList.add("node-control");
  e.innerText = label;
  e.onclick = () => onclick();
  return e;
};
var removeKid = (parent) => (kid) => () => {
  parent.removeChild(kid);
};
var getElementById = (id) => () => document.getElementById(id);
var setTreeDisplay = (str) => () => {
  const e = document.getElementById("tree_display");
  e.innerText = str;
};
var clipboard = void 0;
var set_clipboard = (v) => () => {
  console.log("set_clipboard");
  clipboard = v;
};
var get_clipboard = () => {
  console.log("get_clipboard");
  return clipboard;
};

// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f) {
    return function(g) {
      return function(x) {
        return f(g(x));
      };
    };
  }
};

// output/Control.Category/index.js
var identity = function(dict) {
  return dict.identity;
};
var categoryFn = {
  identity: function(x) {
    return x;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Boolean/index.js
var otherwise = true;

// output/Data.Function/index.js
var $$const = function(a) {
  return function(v) {
    return a;
  };
};

// output/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output/Data.Unit/foreign.js
var unit = void 0;

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var mapFlipped = function(dictFunctor) {
  var map1 = map(dictFunctor);
  return function(fa) {
    return function(f) {
      return map1(f)(fa);
    };
  };
};
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
};
var functorArray = {
  map: arrayMap
};

// output/Control.Apply/index.js
var identity2 = /* @__PURE__ */ identity(categoryFn);
var apply = function(dict) {
  return dict.apply;
};
var applySecond = function(dictApply) {
  var apply1 = apply(dictApply);
  var map3 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map3($$const(identity2))(a))(b);
    };
  };
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var liftA1 = function(dictApplicative) {
  var apply2 = apply(dictApplicative.Apply0());
  var pure1 = pure(dictApplicative);
  return function(f) {
    return function(a) {
      return apply2(pure1(f))(a);
    };
  };
};

// output/Data.Array/foreign.js
var replicateFill = function(count, value) {
  if (count < 1) {
    return [];
  }
  var result = new Array(count);
  return result.fill(value);
};
var replicatePolyfill = function(count, value) {
  var result = [];
  var n = 0;
  for (var i = 0; i < count; i++) {
    result[n++] = value;
  }
  return result;
};
var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var length = function(xs) {
  return xs.length;
};
var indexImpl = function(just, nothing, xs, i) {
  return i < 0 || i >= xs.length ? nothing : just(xs[i]);
};
var zipWithImpl = function(f, xs, ys) {
  var l = xs.length < ys.length ? xs.length : ys.length;
  var result = new Array(l);
  for (var i = 0; i < l; i++) {
    result[i] = f(xs[i])(ys[i]);
  }
  return result;
};

// output/Data.Semigroup/foreign.js
var concatString = function(s1) {
  return function(s2) {
    return s1 + s2;
  };
};
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};

// output/Data.Semigroup/index.js
var semigroupString = {
  append: concatString
};
var semigroupArray = {
  append: concatArray
};
var append = function(dict) {
  return dict.append;
};

// output/Control.Bind/index.js
var bind = function(dict) {
  return dict.bind;
};

// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind2 = bind(dictMonad.Bind1());
  var pure3 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind2(f)(function(f$prime) {
        return bind2(a)(function(a$prime) {
          return pure3(f$prime(a$prime));
        });
      });
    };
  };
};

// output/Data.Bounded/foreign.js
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output/Data.Show/index.js
var show = function(dict) {
  return dict.show;
};

// output/Data.Maybe/index.js
var Nothing = /* @__PURE__ */ function() {
  function Nothing2() {
  }
  ;
  Nothing2.value = new Nothing2();
  return Nothing2;
}();
var Just = /* @__PURE__ */ function() {
  function Just2(value0) {
    this.value0 = value0;
  }
  ;
  Just2.create = function(value0) {
    return new Just2(value0);
  };
  return Just2;
}();

// output/Data.Monoid/index.js
var monoidString = {
  mempty: "",
  Semigroup0: function() {
    return semigroupString;
  }
};
var mempty = function(dict) {
  return dict.mempty;
};

// output/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};

// output/Effect/index.js
var $runtime_lazy = function(name, moduleName, init) {
  var state = 0;
  var val;
  return function(lineNumber) {
    if (state === 2)
      return val;
    if (state === 1)
      throw new ReferenceError(name + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state = 1;
    val = init();
    state = 2;
    return val;
  };
};
var monadEffect = {
  Applicative0: function() {
    return applicativeEffect;
  },
  Bind1: function() {
    return bindEffect;
  }
};
var bindEffect = {
  bind: bindE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var applicativeEffect = {
  pure: pureE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
  return {
    map: liftA1(applicativeEffect)
  };
});
var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
  return {
    apply: ap(monadEffect),
    Functor0: function() {
      return $lazy_functorEffect(0);
    }
  };
});
var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);

// output/Effect.Ref/foreign.js
var _new = function(val) {
  return function() {
    return { value: val };
  };
};
var read = function(ref) {
  return function() {
    return ref.value;
  };
};
var write = function(val) {
  return function(ref) {
    return function() {
      ref.value = val;
    };
  };
};

// output/Effect.Ref/index.js
var $$new = _new;

// output/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output/Data.Foldable/index.js
var foldr = function(dict) {
  return dict.foldr;
};
var traverse_ = function(dictApplicative) {
  var applySecond2 = applySecond(dictApplicative.Apply0());
  var pure3 = pure(dictApplicative);
  return function(dictFoldable) {
    var foldr2 = foldr(dictFoldable);
    return function(f) {
      return foldr2(function($454) {
        return applySecond2(f($454));
      })(pure3(unit));
    };
  };
};
var foldl = function(dict) {
  return dict.foldl;
};
var intercalate = function(dictFoldable) {
  var foldl2 = foldl(dictFoldable);
  return function(dictMonoid) {
    var append3 = append(dictMonoid.Semigroup0());
    var mempty2 = mempty(dictMonoid);
    return function(sep) {
      return function(xs) {
        var go = function(v) {
          return function(v1) {
            if (v.init) {
              return {
                init: false,
                acc: v1
              };
            }
            ;
            return {
              init: false,
              acc: append3(v.acc)(append3(sep)(v1))
            };
          };
        };
        return foldl2(go)({
          init: true,
          acc: mempty2
        })(xs).acc;
      };
    };
  };
};
var foldMapDefaultR = function(dictFoldable) {
  var foldr2 = foldr(dictFoldable);
  return function(dictMonoid) {
    var append3 = append(dictMonoid.Semigroup0());
    var mempty2 = mempty(dictMonoid);
    return function(f) {
      return foldr2(function(x) {
        return function(acc) {
          return append3(f(x))(acc);
        };
      })(mempty2);
    };
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: function(dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
  }
};

// output/Data.Function.Uncurried/foreign.js
var runFn3 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return fn(a, b, c);
      };
    };
  };
};
var runFn4 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};

// output/Data.Traversable/foreign.js
var traverseArrayImpl = /* @__PURE__ */ function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat2(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply2) {
    return function(map3) {
      return function(pure3) {
        return function(f) {
          return function(array) {
            function go(bot, top2) {
              switch (top2 - bot) {
                case 0:
                  return pure3([]);
                case 1:
                  return map3(array1)(f(array[bot]));
                case 2:
                  return apply2(map3(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply2(apply2(map3(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top2 - bot) / 4) * 2;
                  return apply2(map3(concat2)(go(bot, pivot)))(go(pivot, top2));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output/Data.Traversable/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
var traverse = function(dict) {
  return dict.traverse;
};
var sequenceDefault = function(dictTraversable) {
  var traverse22 = traverse(dictTraversable);
  return function(dictApplicative) {
    return traverse22(dictApplicative)(identity3);
  };
};
var traversableArray = {
  traverse: function(dictApplicative) {
    var Apply0 = dictApplicative.Apply0();
    return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
  },
  sequence: function(dictApplicative) {
    return sequenceDefault(traversableArray)(dictApplicative);
  },
  Functor0: function() {
    return functorArray;
  },
  Foldable1: function() {
    return foldableArray;
  }
};
var sequence = function(dict) {
  return dict.sequence;
};

// output/Data.Array/index.js
var sequence2 = /* @__PURE__ */ sequence(traversableArray);
var intercalate1 = /* @__PURE__ */ intercalate(foldableArray);
var zipWith = /* @__PURE__ */ runFn3(zipWithImpl);
var zipWithA = function(dictApplicative) {
  var sequence12 = sequence2(dictApplicative);
  return function(f) {
    return function(xs) {
      return function(ys) {
        return sequence12(zipWith(f)(xs)(ys));
      };
    };
  };
};
var $$null = function(xs) {
  return length(xs) === 0;
};
var intercalate2 = function(dictMonoid) {
  return intercalate1(dictMonoid);
};
var index = /* @__PURE__ */ function() {
  return runFn4(indexImpl)(Just.create)(Nothing.value);
}();

// output/Effect.Class/index.js
var monadEffectEffect = {
  liftEffect: /* @__PURE__ */ identity(categoryFn),
  Monad0: function() {
    return monadEffect;
  }
};
var liftEffect = function(dict) {
  return dict.liftEffect;
};

// output/Effect.Console/foreign.js
var log = function(s) {
  return function() {
    console.log(s);
  };
};

// output/Effect.Class.Console/index.js
var log2 = function(dictMonadEffect) {
  var $67 = liftEffect(dictMonadEffect);
  return function($68) {
    return $67(log($68));
  };
};

// output/Partial.Unsafe/foreign.js
var _unsafePartial = function(f) {
  return f();
};

// output/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output/Partial/index.js
var crashWith = function() {
  return _crashWith;
};

// output/Partial.Unsafe/index.js
var crashWith2 = /* @__PURE__ */ crashWith();
var unsafePartial = _unsafePartial;
var unsafeCrashWith = function(msg) {
  return unsafePartial(function() {
    return crashWith2(msg);
  });
};

// output/Main/index.js
var append2 = /* @__PURE__ */ append(semigroupArray);
var traverse2 = /* @__PURE__ */ traverse(traversableArray)(applicativeEffect);
var map2 = /* @__PURE__ */ map(functorEffect);
var zipWithA2 = /* @__PURE__ */ zipWithA(applicativeEffect);
var pure2 = /* @__PURE__ */ pure(applicativeEffect);
var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorEffect);
var $$void2 = /* @__PURE__ */ $$void(functorEffect);
var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableArray);
var intercalate3 = /* @__PURE__ */ intercalate2(monoidString);
var mapFlipped1 = /* @__PURE__ */ mapFlipped(functorArray);
var Tree = /* @__PURE__ */ function() {
  function Tree2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Tree2.create = function(value0) {
    return function(value1) {
      return new Tree2(value0, value1);
    };
  };
  return Tree2;
}();
var Tooth = /* @__PURE__ */ function() {
  function Tooth2(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  Tooth2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new Tooth2(value0, value1, value2);
      };
    };
  };
  return Tooth2;
}();
var InjectDiff = /* @__PURE__ */ function() {
  function InjectDiff2(value0) {
    this.value0 = value0;
  }
  ;
  InjectDiff2.create = function(value0) {
    return new InjectDiff2(value0);
  };
  return InjectDiff2;
}();
var PlusDiff = /* @__PURE__ */ function() {
  function PlusDiff2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  PlusDiff2.create = function(value0) {
    return function(value1) {
      return new PlusDiff2(value0, value1);
    };
  };
  return PlusDiff2;
}();
var MinusDiff = /* @__PURE__ */ function() {
  function MinusDiff2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  MinusDiff2.create = function(value0) {
    return function(value1) {
      return new MinusDiff2(value0, value1);
    };
  };
  return MinusDiff2;
}();
var ReplaceDiff = /* @__PURE__ */ function() {
  function ReplaceDiff2(value0) {
    this.value0 = value0;
  }
  ;
  ReplaceDiff2.create = function(value0) {
    return new ReplaceDiff2(value0);
  };
  return ReplaceDiff2;
}();
var IdDiff = /* @__PURE__ */ function() {
  function IdDiff2() {
  }
  ;
  IdDiff2.value = new IdDiff2();
  return IdDiff2;
}();
var CutDiff = /* @__PURE__ */ function() {
  function CutDiff2(value0) {
    this.value0 = value0;
  }
  ;
  CutDiff2.create = function(value0) {
    return new CutDiff2(value0);
  };
  return CutDiff2;
}();
var PasteDiff = /* @__PURE__ */ function() {
  function PasteDiff2() {
  }
  ;
  PasteDiff2.value = new PasteDiff2();
  return PasteDiff2;
}();
var unsafeFromJust = function(v) {
  if (v instanceof Nothing) {
    return unsafeCrashWith("unsafeFromJust Nothing");
  }
  ;
  if (v instanceof Just) {
    return v.value0;
  }
  ;
  throw new Error("Failed pattern match at Main (line 170, column 18 - line 172, column 14): " + [v.constructor.name]);
};
var unTooth = function(v) {
  return function(t) {
    return new Tree(v.value0, append2(v.value1)(append2([t])(v.value2)));
  };
};
var fromTreeCreateElement = function(v) {
  return function __do2() {
    var es = traverse2(fromTreeCreateElement)(v.value1)();
    return createElement(v.value0)(es)();
  };
};
var examples = /* @__PURE__ */ function() {
  return [{
    label: "insert {X Y1 {} Y2} at A1",
    diff: new PlusDiff(new Tooth("X", [new Tree("Y1", [])], [new Tree("Y2", [])]), IdDiff.value)
  }, {
    label: "insert {X Y1 {} Y2} at B2",
    diff: new InjectDiff([IdDiff.value, new PlusDiff(new Tooth("X", [new Tree("Y1", [])], [new Tree("Y2", [])]), IdDiff.value), IdDiff.value])
  }, {
    label: "remove {B2 C4 {} C6}",
    diff: new InjectDiff([IdDiff.value, new MinusDiff(1, IdDiff.value), IdDiff.value])
  }, {
    label: "cut B1 ...",
    diff: new InjectDiff([new CutDiff("HOLE"), IdDiff.value, IdDiff.value])
  }, {
    label: "... then paste onto B3",
    diff: new InjectDiff([IdDiff.value, IdDiff.value, PasteDiff.value])
  }];
}();
var example_tree = /* @__PURE__ */ function() {
  return new Tree("A1", [new Tree("B1", [new Tree("C1", []), new Tree("C2", []), new Tree("C3", [])]), new Tree("B2", [new Tree("C4", []), new Tree("C5", []), new Tree("C6", [])]), new Tree("B3", [new Tree("C7", []), new Tree("C8", []), new Tree("C9", [])])]);
}();
var applyTreeDiffToTree = function(v) {
  return function(v1) {
    if (v instanceof InjectDiff) {
      return map2(Tree.create(v1.value0))(zipWithA2(applyTreeDiffToTree)(v.value0)(v1.value1));
    }
    ;
    if (v instanceof PlusDiff) {
      return map2(unTooth(v.value0))(applyTreeDiffToTree(v.value1)(v1));
    }
    ;
    if (v instanceof MinusDiff) {
      return applyTreeDiffToTree(v.value1)(unsafeFromJust(index(v1.value1)(v.value0)));
    }
    ;
    if (v instanceof ReplaceDiff) {
      return pure2(v.value0);
    }
    ;
    if (v instanceof IdDiff) {
      return pure2(v1);
    }
    ;
    if (v instanceof CutDiff) {
      return pure2(new Tree(v.value0, []));
    }
    ;
    if (v instanceof PasteDiff) {
      return mapFlipped2(get_clipboard)(function(v2) {
        return v2.tree;
      });
    }
    ;
    throw new Error("Failed pattern match at Main (line 83, column 1 - line 83, column 55): " + [v.constructor.name, v1.constructor.name]);
  };
};
var applyTreeDiffToDom$prime = function(v) {
  return function(v1) {
    if (v instanceof InjectDiff) {
      return $$void2(zipWithA2(applyTreeDiffToDom$prime)(v.value0)(v1.value1));
    }
    ;
    if (v instanceof PlusDiff) {
      return function __do2() {
        applyTreeDiffToDom$prime(v.value1)(v1)();
        var es_left = traverse2(fromTreeCreateElement)(v.value0.value1)();
        var e2 = getElement(v1.value0)();
        var es_right = traverse2(fromTreeCreateElement)(v.value0.value2)();
        var e_parent = getParent(e2)();
        var e1 = createElement(v.value0.value0)([])();
        replaceKid(e_parent)({
          old: e2,
          "new": e1
        })();
        traverse_2(addKid(e1))(es_left)();
        addKid(e1)(e2)();
        return traverse_2(addKid(e1))(es_right)();
      };
    }
    ;
    if (v instanceof MinusDiff) {
      return function __do2() {
        var e = getElement(v1.value0)();
        var v2 = unsafeFromJust(index(v1.value1)(v.value0));
        applyTreeDiffToDom$prime(v.value1)(v2)();
        var e_kid = getElement(v2.value0)();
        var e_parent = getParent(e)();
        return replaceKid(e_parent)({
          old: e,
          "new": e_kid
        })();
      };
    }
    ;
    if (v instanceof ReplaceDiff) {
      return function __do2() {
        var e = getElement(v1.value0)();
        var e_parent = getParent(e)();
        var e$prime = fromTreeCreateElement(v.value0)();
        return replaceKid(e_parent)({
          old: e,
          "new": e$prime
        })();
      };
    }
    ;
    if (v instanceof IdDiff) {
      return pure2(unit);
    }
    ;
    if (v instanceof CutDiff) {
      return function __do2() {
        var e = getElement(v1.value0)();
        var e_parent = getParent(e)();
        var e$prime = createElement(v.value0)([])();
        replaceKid(e_parent)({
          old: e,
          "new": e$prime
        })();
        set_clipboard({
          tree: v1,
          element: e
        })();
        return unit;
      };
    }
    ;
    if (v instanceof PasteDiff) {
      return function __do2() {
        var e = getElement(v1.value0)();
        var e_parent = getParent(e)();
        var clipboard2 = get_clipboard();
        replaceKid(e_parent)({
          old: e,
          "new": clipboard2.element
        })();
        return unit;
      };
    }
    ;
    throw new Error("Failed pattern match at Main (line 106, column 1 - line 106, column 55): " + [v.constructor.name, v1.constructor.name]);
  };
};
var _Show_Tree = {
  show: function(v) {
    if ($$null(v.value1)) {
      return v.value0;
    }
    ;
    if (otherwise) {
      return "(" + (v.value0 + (" " + (intercalate3(" ")(mapFlipped1(v.value1)(show(_Show_Tree))) + ")")));
    }
    ;
    throw new Error("Failed pattern match at Main (line 61, column 1 - line 64, column 85): " + [v.constructor.name]);
  }
};
var show2 = /* @__PURE__ */ show(_Show_Tree);
var applyTreeDiffToDom = function(d) {
  return function(t_ref) {
    return function __do2() {
      var t = read(t_ref)();
      var t$prime = applyTreeDiffToTree(d)(t)();
      write(t$prime)(t_ref)();
      setTreeDisplay(show2(t$prime))();
      return applyTreeDiffToDom$prime(d)(t)();
    };
  };
};
var fromTreeCreateDom = function(t) {
  return function __do2() {
    setTreeDisplay(show2(t))();
    var e = fromTreeCreateElement(t)();
    var c = getContainer();
    return addKid(c)(e)();
  };
};
var main = function __do() {
  log2(monadEffectEffect)("[main]")();
  var tree_ref = $$new(example_tree)();
  fromTreeCreateDom(example_tree)();
  var examples_container = getElementById("examples")();
  traverse_2(function(v) {
    return function __do2() {
      var btn = createButton({
        label: v.label,
        onclick: applyTreeDiffToDom(v.diff)(tree_ref)
      })();
      return addKid(examples_container)(btn)();
    };
  })(examples)();
  return unit;
};
export {
  CutDiff,
  IdDiff,
  InjectDiff,
  MinusDiff,
  PasteDiff,
  PlusDiff,
  ReplaceDiff,
  Tooth,
  Tree,
  _Show_Tree,
  addKid,
  applyTreeDiffToDom,
  applyTreeDiffToDom$prime,
  applyTreeDiffToTree,
  createButton,
  createElement,
  example_tree,
  examples,
  fromTreeCreateDom,
  fromTreeCreateElement,
  getContainer,
  getElement,
  getElementById,
  getParent,
  get_clipboard,
  main,
  removeKid,
  replaceKid,
  setTreeDisplay,
  set_clipboard,
  unTooth,
  unsafeFromJust
};
//# sourceMappingURL=main.js.map
