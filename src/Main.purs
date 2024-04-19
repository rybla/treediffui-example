module Main where

import Control.Monad.Trans.Class
import Data.Tuple.Nested
import Prelude
import Control.Monad.State (StateT, evalStateT, modify, runStateT)
import Data.Array as Array
import Data.List.Lazy (replicate)
import Data.Maybe (Maybe(..))
import Data.String as String
import Data.Traversable (sequence, traverse, traverse_)
import Data.UUID (genUUID)
import Effect (Effect)
import Effect.Class.Console as Console
import Effect.Console (log)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import Partial.Unsafe (unsafeCrashWith)

example_tree :: Tree
example_tree = "A1" % [ "B1" % [ "C1" % [], "C2" % [], "C3" % [] ], "B2" % [ "C4" % [], "C5" % [], "C6" % [] ], "B3" % [ "C7" % [], "C8" % [], "C9" % [] ] ]

examples :: Array { label :: String, diff :: TreeDiff }
examples =
  [ { label: "insert {X Y1 {} Y2} at A1"
    , diff: PlusDiff (Tooth "X" [ "Y1" % [] ] [ "Y2" % [] ]) IdDiff
    }
  , { label: "insert {X Y1 {} Y2} at B2"
    , diff: InjectDiff [ IdDiff, PlusDiff (Tooth "X" [ "Y1" % [] ] [ "Y2" % [] ]) IdDiff, IdDiff ]
    }
  , { label: "remove {B2 C4 {} C6}"
    , diff: InjectDiff [ IdDiff, MinusDiff 1 IdDiff, IdDiff ]
    }
  , { label: "cut B1 ..."
    , diff: InjectDiff [ CutDiff "HOLE", IdDiff, IdDiff ]
    }
  , { label: "... then paste onto B3"
    , diff: InjectDiff [ IdDiff, IdDiff, PasteDiff ]
    }
  ]

main :: Effect Unit
main = do
  Console.log "[main]"
  tree_ref <- Ref.new example_tree
  fromTreeCreateDom example_tree
  examples_container <- getElementById "examples"
  examples
    # traverse_ \{ label, diff } -> do
        btn <- createButton { label, onclick: applyTreeDiffToDom diff tree_ref }
        addKid examples_container btn
  pure unit

type TreeLabel
  = String

data Tree
  = Tree TreeLabel (Array Tree)

instance _Show_Tree :: Show Tree where
  show (Tree id ts)
    | Array.null ts = id
    | otherwise = "(" <> id <> " " <> ((ts <#> show) # Array.intercalate " ") <> ")"

infix 4 Tree as %

data Tooth
  = Tooth TreeLabel (Array Tree) (Array Tree)

unTooth :: Tooth -> Tree -> Tree
unTooth (Tooth l ts_left ts_right) t = Tree l (ts_left <> [ t ] <> ts_right)

data TreeDiff
  = InjectDiff (Array TreeDiff)
  | PlusDiff Tooth TreeDiff
  | MinusDiff Int TreeDiff
  | ReplaceDiff Tree
  | IdDiff
  | CutDiff TreeLabel
  | PasteDiff

applyTreeDiffToTree :: TreeDiff -> Tree -> Effect Tree
applyTreeDiffToTree (InjectDiff dts) (Tree l ts) = Tree l <$> Array.zipWithA applyTreeDiffToTree dts ts

applyTreeDiffToTree (PlusDiff th td) t = unTooth th <$> applyTreeDiffToTree td t

applyTreeDiffToTree (MinusDiff i td) (Tree _ ts) = applyTreeDiffToTree td (ts Array.!! i # unsafeFromJust)

applyTreeDiffToTree (ReplaceDiff t') _ = t' # pure

applyTreeDiffToTree IdDiff t = t # pure

applyTreeDiffToTree (CutDiff id) _ = Tree id [] # pure

applyTreeDiffToTree PasteDiff _ = get_clipboard <#> _.tree

applyTreeDiffToDom :: TreeDiff -> Ref Tree -> Effect Unit
applyTreeDiffToDom d t_ref = do
  t <- Ref.read t_ref
  t' <- applyTreeDiffToTree d t
  Ref.write t' t_ref
  setTreeDisplay (show t')
  applyTreeDiffToDom' d t

applyTreeDiffToDom' :: TreeDiff -> Tree -> Effect Unit
applyTreeDiffToDom' (InjectDiff dts) (Tree l ts) = do
  Array.zipWithA applyTreeDiffToDom' dts ts # void -- RECURSE

applyTreeDiffToDom' (PlusDiff (Tooth l1 ts_left ts_right) td) t@(Tree l2 ts) = do
  applyTreeDiffToDom' td t -- RECURSE
  es_left <- ts_left # traverse fromTreeCreateElement
  -- e2 will be a kid of e1
  e2 <- getElement l2
  es_right <- ts_right # traverse fromTreeCreateElement
  e_parent <- getParent e2
  -- create a tmp e1 that has no kids, but will eventually be the parent of e2
  e1 <- createElement l1 []
  -- replace e2 with e1
  replaceKid e_parent { old: e2, new: e1 }
  -- then add kids of e1, one of which is e2
  es_left # traverse_ (addKid e1)
  e2 # addKid e1
  es_right # traverse_ (addKid e1)

applyTreeDiffToDom' (MinusDiff i td) (Tree l ts) = do
  e <- getElement l
  t_kid@(Tree l_kid _) <- ts Array.!! i # unsafeFromJust # pure
  applyTreeDiffToDom' td t_kid -- RECURSE
  e_kid <- getElement l_kid
  e_parent <- getParent e
  replaceKid e_parent { old: e, new: e_kid }

applyTreeDiffToDom' (ReplaceDiff t') (Tree l _) = do
  e <- getElement l
  e_parent <- getParent e
  e' <- fromTreeCreateElement t'
  replaceKid e_parent { old: e, new: e' }

applyTreeDiffToDom' IdDiff _ = pure unit

applyTreeDiffToDom' (CutDiff l') t@(Tree l _) = do
  e <- getElement l
  e_parent <- getParent e
  e' <- createElement l' []
  replaceKid e_parent { old: e, new: e' }
  set_clipboard { tree: t, element: e }
  pure unit

applyTreeDiffToDom' PasteDiff (Tree l _) = do
  e <- getElement l
  e_parent <- getParent e
  clipboard <- get_clipboard
  replaceKid e_parent { old: e, new: clipboard.element }
  pure unit

fromTreeCreateDom :: Tree -> Effect Unit
fromTreeCreateDom t = do
  setTreeDisplay (show t)
  e <- fromTreeCreateElement t
  c <- getContainer
  addKid c e

fromTreeCreateElement :: Tree -> Effect Element
fromTreeCreateElement (Tree l ts) = do
  es <- ts # traverse fromTreeCreateElement
  createElement l es

unsafeFromJust :: forall t27. Maybe t27 -> t27
unsafeFromJust = case _ of
  Nothing -> unsafeCrashWith "unsafeFromJust Nothing"
  Just a -> a

foreign import data Element :: Type

foreign import getElement :: TreeLabel -> Effect Element

foreign import createElement :: TreeLabel -> Array Element -> Effect Element

foreign import addKid :: Element -> Element -> Effect Unit

foreign import getContainer :: Effect Element

foreign import getParent :: Element -> Effect Element

foreign import replaceKid :: Element -> { old :: Element, new :: Element } -> Effect Unit

foreign import createButton :: { label :: String, onclick :: Effect Unit } -> Effect Element

foreign import getElementById :: String -> Effect Element

foreign import setTreeDisplay :: String -> Effect Unit

foreign import removeKid :: Element -> Element -> Effect Unit

foreign import set_clipboard :: { tree :: Tree, element :: Element } -> Effect Unit

foreign import get_clipboard :: Effect { tree :: Tree, element :: Element }
