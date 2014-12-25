/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
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
           Name, Parser, Pattern, PDFJS, warn, Util, Promise,
           createPromiseCapability, QuadTree */
 
'use strict';
 
var TextLayoutEvaluator = (function TextLayoutEvaluatorClosure() {
  function TextLayoutEvaluator() {
  }
 
  var NonWhitespaceRegexp = /\S/;
  function isAllWhitespace(str) {
    return !NonWhitespaceRegexp.test(str);
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

  TextLayoutEvaluator.prototype = {
    overlapBy : function (min1, min2, max1, max2, by) {
        var d = Math.min(max1,max2) - Math.max(min1,min2);
        return d > (max1-min1) * by || d > (max2-min2) * by;
    },
    
    addToQuadTree: function(o, i, styles) {
      var style = styles[o.fontName];
      if (isAllWhitespace(o.str)) {
        // Whitespace elements aren't visible, but they're used for copy/paste.
        o.isWhitespace = true;
      } else {
        // Line numbers can mess up flow, so we detect and handle them them.
        var n = Number(o.str.replace(/^\s+|\s+$/g,''));
        if(n % 1 === 0) {
          o.asInt = n;
        }
      }
      var tx = o.transform;
      
      var angle = Math.atan2(tx[1], tx[0]);
      if (style.vertical) {
        angle += Math.PI / 2;
      }
      var fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
      var fontAscent = fontHeight;
      if (style.ascent) {
        fontAscent = style.ascent * fontAscent;
      } else if (style.descent) {
        fontAscent = (1 + style.descent) * fontAscent;
      }

      if (angle === 0) {
        o.x = tx[4];
        o.y = tx[5] - fontAscent;
      } else {
        o.x = tx[4] + (fontAscent * Math.sin(angle));
        o.y = tx[5] - (fontAscent * Math.cos(angle));
      }
      o.vertical = style.vertical;
      
      o.id = i;         // Used to uniquely identify object.
      o.right = null;   // The nearest object to the right.
      o.bottom = null;  // The nearest object to the left.
          
      this.quadtree.insert(o);
    },
    
    calculateTextFlow: function (bounds, objs, styles) {
      var timeSlotManager = new TimeSlotManager();
      var self = this;
      self.bounds = bounds;
      
      // Put everything into the quadtree so it's fast to look things up.
      self.quadtree = new QuadTree(bounds, 4, 16);
      for (var i = 0, len = objs.length; i < len; i++) {
        self.addToQuadTree(objs[i], i, styles);
      }
      
      // The top item has a big impact on the flow, so track it.
      var top_obj = null;
      
      // Set each element's padding to run to the nearest right and bottom 
      // element. The padding ensures that text selection works.
      for (i = 0; i < len; i++) {
        var d = objs[i];
        var d_x2 = d.x + d.width;
        var d_y2 = d.y + d.height;
        
        // Keep track of the top most item.
        if(!d.isWhitespace && (top_obj === null || d.y > top_obj.y)) {
            top_obj = d;
        }
        // Find the first object to the right.
        var xinc = self.quadtree.retrieve_xinc(d.x+d.width,d.y,d.height);
        do {
          var dr = xinc.next();
          if(dr && dr.id !== d.id) {
            d.right = dr.id;
            break;
          }
        } while(dr);
        
        // Find the object directly below, subtract the height to move down.
        var ydec = self.quadtree.retrieve_ydec(d.x,d.y-d.height,d.width);
        do {
          var db = ydec.next();
          if(db && db.id !== d.id) {
            d.bottom = db.id;
            break;
          }
        } while(db);
      }
    }
  };
  return TextLayoutEvaluator;
})();