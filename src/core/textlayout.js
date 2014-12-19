/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ 
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */ 
/* Copyright 2012 Mozilla Foundation 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at 
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0 
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License. 
 */ 
/* globals assert, ColorSpace, DecodeStream, Dict, Encodings, 
           error, ErrorFont, Font, FONT_IDENTITY_MATRIX, fontCharsToUnicode, 
           FontFlags, ImageKind, info, isArray, isCmd, isDict, isEOF, isName, 
           isNum, isStream, isString, JpegStream, Lexer, Metrics, 
           MurmurHash3_64, Name, Parser, Pattern, PDFImage, PDFJS, serifFonts, 
           stdFontMap, symbolsFonts, getTilingPatternIR, warn, Util, Promise, 
           RefSetCache, isRef, TextRenderingMode, ToUnicodeMap, CMapFactory, 
           OPS, UNSUPPORTED_FEATURES, UnsupportedManager, NormalizedUnicodes, 
           IDENTITY_MATRIX, reverseIfRtl, createPromiseCapability, 
           getFontType */ 
 
'use strict';
 
var TextLayoutEvaluator = (function TextLayoutEvaluatorClosure() { 
  function TextLayoutEvaluator() { 
  } 
 
  // Trying to minimize Date.now() usage and check every 100 time 
  var TIME_SLOT_DURATION_MS = 20; 
  var CHECK_TIME_EVERY = 100; 
  function TimeSlotManager() { 
    this.reset(); 
  } 
  TimeSlotManager.prototype = { 
    check: function TimeSlotManager_check() { 
      if (++this.checked < CHECK_TIME_EVERY) { 
        return false; 
      } 
      this.checked = 0; 
      return this.endTime <= Date.now(); 
    }, 
    reset: function TimeSlotManager_reset() { 
      this.endTime = Date.now() + TIME_SLOT_DURATION_MS; 
      this.checked = 0; 
    } 
  };
  var deferred = Promise.resolve();

  var TILING_PATTERN = 1, SHADING_PATTERN = 2;

  TextLayoutEvaluator.prototype = {
  
    /**
     * Returns true if an element and the element directly to the right could
     * be two separate columns in a text column.
     *
     * @d     the div that we're checking.
     * @right structure telling us the div to the right.
     * @bottom structure telling us the div to the bottom.
     *
     * @return true if the right item "could be" a separate text column. We 
     *         return false if we know that it isn't.  We change the text 
     *         layout if it's not a column in order to improve selectability.
     **/
    could_be_column : function (d, right, bottom) {
      if(right.d < 1.25*N(d.width)/d.innerHTML.length) {
          // If the space to the right less than a char length, not a column.
          return false;
      }
      if(N(d.width) > page_width/2) {
          // Can't be true if we're so wide.
          return false;
      }
      var divr = textDivs[right.j];
      if(right.d < 1.25*N(divr.width)/divr.innerHTML.length) {
          // If the space to the right less than a char length, not a column.
          return false;
      }
      if(N(divr.width) > page_width/2) {
          // Can't be true if the right is so wide.
          return false;
      }
      // If the horizontal space between d and divr is much smaller than the
      // vertical space between the next legitimate line.
      if(bottom.j !== null && right.d < bottom.d &&
                      bottom.d < N(d.height)) {
          return false;
      }
      // Whitespace should not connect columns and won't matter if it does.
      if(d.isWhitespace || divr.isWhitespace) {
          return false;
      }
      
      // We cannot rule out that this is a text column, return true.
      return true;
    }
    
    could_be_next_line : function (d, bottom) {
      // Return true if bottom could be a line directly underneath d.
      if(bottom.j === null) {
          return false;
      }
      // They have to be vertically close
      if(bottom.d > N(d.height)) {
          return false;
      }
      // They must horizontally encapsulate each other.
      var divb = textDivs[bottom.j];
      if(!overlapBy(d.left, divb.left,
                      N(d.left) + N(d.width),
                      N(divb.left) + N(divb.width), 0.99)) {
          return false;
      }
      return true;
    }
      
  
    calculateTextFlow: function TextLayoutEvaluator_calculateTextFlow(
              objs, styles) {

      stateManager = (stateManager || new StateManager(new TextState()));
      var self = this;

      return new Promise(function next(resolve, reject) {
        timeSlotManager.reset();
        var stop, operation = {}, args = [];
        while (!(stop = timeSlotManager.check())) {
          // The arguments parsed by read() are not used beyond this loop, so
          // we can reuse the same array on every iteration, thus avoiding
          // unnecessary allocations.
          args.length = 0;
          operation.args = args;
          if (!(preprocessor.read(operation))) {
            break;
          }
          textState = stateManager.state;
          var fn = operation.fn;
          args = operation.args;
        textState.fontSize = args[1];
            return handleSetFont(args[0].name).then(function() {
              next(resolve, reject);
            }, reject);
        
        } // while
        if (stop) {
          deferred.then(function () {
            next(resolve, reject);
          });
          return;
        }
        resolve(textContent);
      });
    }
  }
});