/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* globals expect, it, describe, beforeEach, isArray, QuadTree */

'use strict';

describe('quadtree', function() {
  var bounds = {x:0,y:0,width:100, height:100};
  describe('Quadtree Basics', function() {
    it('empty quadtree', function() {
      var quad = new QuadTree(bounds);
      expect(quad.length).toEqual(0);
      expect(quad.retrieve({x:5,y:5,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:55,y:5,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:5,y:55,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:55,y:55,width:1,height:1})).toEqual([]);
    });
    it('quadtree len of one', function() {
      var quad = new QuadTree(bounds);
      var items = [{x:2,y:2,width:96, height:96, id:0}];
      quad.insert(items[0]);
      expect(quad.length).toEqual(1);
      
      // Check all quadrants that it's there
      expect(quad.retrieve({x:5,y:5,width:1,height:1})).toEqual(items);
      expect(quad.retrieve({x:55,y:5,width:1,height:1})).toEqual(items);
      expect(quad.retrieve({x:5,y:55,width:1,height:1})).toEqual(items);
      expect(quad.retrieve({x:55,y:55,width:1,height:1})).toEqual(items);
      
      // Check all quadrants that it's not
      expect(quad.retrieve({x:1,y:1,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:1,y:99,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:99,y:1,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:99,y:99,width:0.5,height:0.5})).toEqual([]);
      // Check on the sides
      expect(quad.retrieve({x:50,y:1,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:50,y:99,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:1,y:50,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:99,y:50,width:0.5,height:0.5})).toEqual([]);
      
      // Check the boundaries - Just in boundaries
      expect(quad.retrieve({x:2,y:2,width:5,height:5})).toEqual(items);
      expect(quad.retrieve({x:2,y:94,width:5,height:5})).toEqual(items);
      expect(quad.retrieve({x:94,y:2,width:5,height:5})).toEqual(items);
      expect(quad.retrieve({x:94,y:94,width:5,height:5})).toEqual(items);
      // Check the boundaries - Just outside corners
      expect(quad.retrieve({x:98,y:1,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:1,y:98,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:98,y:50,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:98,y:98,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:50,y:98,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:1,y:1,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:1,y:50,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:50,y:1,width:1,height:1})).toEqual([]);
      // Check the boundaries - sides
      expect(quad.retrieve({x:50,y:98,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:98,y:50,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:98,y:98,width:1,height:1})).toEqual([]);
      
      // Just over the boundaries
      expect(quad.retrieve({x:1.01,y:1.01,width:1,height:1})).toEqual(items);
    });
    
    it('repeated elements in quadtree', function() {
      var quad = new QuadTree(bounds);
      var items = [
        {x:2,y:2,width:96, height:96, id:0},
        {x:2,y:2,width:96, height:96, id:1},
        {x:2,y:2,width:96, height:96, id:2},
        {x:2,y:2,width:96, height:96, id:3},
        {x:2,y:2,width:96, height:96, id:4},
        {x:2,y:2,width:96, height:96, id:5},
        {x:2,y:2,width:96, height:96, id:6},
        {x:2,y:2,width:96, height:96, id:7},
        {x:2,y:2,width:96, height:96, id:8}
      ];
      quad.insert(items);
      expect(quad.length).toEqual(items.length);
      // Check all quadrants that it's there
      expect(quad.retrieve({x:5,y:5,width:1,height:1})).toEqual(items);
      expect(quad.retrieve({x:55,y:5,width:1,height:1})).toEqual(items);
      expect(quad.retrieve({x:5,y:55,width:1,height:1})).toEqual(items);
      expect(quad.retrieve({x:55,y:55,width:1,height:1})).toEqual(items);
      
      // Check all quadrants that it's not
      expect(quad.retrieve({x:1,y:1,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:1,y:99,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:99,y:1,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:99,y:99,width:0.5,height:0.5})).toEqual([]);
      // Check on the sides
      expect(quad.retrieve({x:50,y:1,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:50,y:99,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:1,y:50,width:0.5,height:0.5})).toEqual([]);
      expect(quad.retrieve({x:99,y:50,width:0.5,height:0.5})).toEqual([]);
      
      // Check the boundaries - Just in boundaries
      expect(quad.retrieve({x:2,y:2,width:5,height:5})).toEqual(items);
      expect(quad.retrieve({x:2,y:94,width:5,height:5})).toEqual(items);
      expect(quad.retrieve({x:94,y:2,width:5,height:5})).toEqual(items);
      expect(quad.retrieve({x:94,y:94,width:5,height:5})).toEqual(items);
      // Check the boundaries - Just outside corners
      expect(quad.retrieve({x:98,y:1,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:1,y:98,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:98,y:50,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:98,y:98,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:50,y:98,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:1,y:1,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:1,y:50,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:50,y:1,width:1,height:1})).toEqual([]);
      // Check the boundaries - sides
      expect(quad.retrieve({x:50,y:98,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:98,y:50,width:1,height:1})).toEqual([]);
      expect(quad.retrieve({x:98,y:98,width:1,height:1})).toEqual([]);
      
      // Just over the boundaries
      expect(quad.retrieve({x:1.01,y:1.01,width:1,height:1})).toEqual(items);
    });
  });
  
  describe('Quadtree X Iteration', function() {
    var quad = new QuadTree(bounds);
    var items = [
      {x:2,y:49,width:2, height:2, id:0},
      {x:4,y:49,width:2, height:2, id:1},
      {x:6,y:49,width:2, height:2, id:2},
      {x:8,y:49,width:2, height:2, id:3},
      {x:10,y:49,width:2, height:2, id:4},
      {x:12,y:49,width:2, height:2, id:5},
    ];
    quad.insert(items);
    
    function test_iterate_x_tests() {
      // Runs tests on a quad in the x direction. 
      var out = [];
      quad.retrieve_xinc(0,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items);
      out = [];
      quad.retrieve_xinc(0,49,5,function(c) { out.push(c); });
      expect(out).toEqual(items);
      
      // Skip the first
      out = [];
      quad.retrieve_xinc(4,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(1));
      // Skip all
      out = [];
      quad.retrieve_xinc(14,49,1,function(c) { out.push(c); });
      expect(out).toEqual([]);
      // Get the edges
      out = [];
      quad.retrieve_xinc(0,48,1,function(c) { out.push(c); });
      expect(out).toEqual([]);
      out = [];
      quad.retrieve_xinc(0,51,1,function(c) { out.push(c); });
      expect(out).toEqual([]);
      
      // Now test the same in reverse
      items.reverse();
      
      out = [];
      quad.retrieve_xdec(50,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items);
      out = [];
      quad.retrieve_xdec(13,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items);
      // Skip the first
      out = [];
      quad.retrieve_xdec(12,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(1));
      out = [];
      quad.retrieve_xdec(9,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(2));
      // Get the edges
      out = [];
      quad.retrieve_xdec(8,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(3));
      out = [];
      quad.retrieve_xdec(6,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(4));
      out = [];
      quad.retrieve_xdec(4,49,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(5));
      out = [];
      quad.retrieve_xdec(2,49,1,function(c) { out.push(c); });
      expect(out).toEqual([]);
      
      // Put items back into forward order
      items.reverse();
    }
    
    
    it('iterate x alone', test_iterate_x_tests);
    // Add a number of objects
    for(var i=0; i<100; i += 5) {
      quad.insert({x:i, y:i/20, width:1, height:1});
    }
    // Adding the objects above should not have changed the test
    it('iterate x with objs', test_iterate_x_tests);
    for(i=0; i<100; i += 5) {
      quad.insert({x:99-i, y:98-i/20, width:1, height:1});
    }
    it('iterate x with more objs', test_iterate_x_tests);
  });
  
  
  
  describe('Quadtree Y Iteration', function() {
    var quad = new QuadTree(bounds);
    var items = [
      {y:2,x:49,width:2, height:2, id:0},
      {y:4,x:49,width:2, height:2, id:1},
      {y:6,x:49,width:2, height:2, id:2},
      {y:8,x:49,width:2, height:2, id:3},
      {y:10,x:49,width:2, height:2, id:4},
      {y:12,x:49,width:2, height:2, id:5},
    ];
    quad.insert(items);
    
    function test_iterate_y_tests() {
      // Runs tests on a quad in the x direction. 
      var out = [];
      quad.retrieve_yinc(49,0,1,function(c) { out.push(c); });
      expect(out).toEqual(items);
      out = [];
      quad.retrieve_yinc(49,0,5,function(c) { out.push(c); });
      expect(out).toEqual(items);
      
      // Skip the first
      out = [];
      quad.retrieve_yinc(49,4,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(1));
      // Skip all
      out = [];
      quad.retrieve_yinc(49,14,1,function(c) { out.push(c); });
      expect(out).toEqual([]);
      // Get the edges
      out = [];
      quad.retrieve_yinc(48,0,1,function(c) { out.push(c); });
      expect(out).toEqual([]);
      out = [];
      quad.retrieve_yinc(51,0,1,function(c) { out.push(c); });
      expect(out).toEqual([]);
      
      // Now test the same in reverse
      items.reverse();
      
      out = [];
      quad.retrieve_ydec(49,50,1,function(c) { out.push(c); });
      expect(out).toEqual(items);
      out = [];
      quad.retrieve_ydec(49,13,1,function(c) { out.push(c); });
      expect(out).toEqual(items);
      // Skip the first
      out = [];
      quad.retrieve_ydec(49,12,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(1));
      out = [];
      quad.retrieve_ydec(49,9,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(2));
      // Get the edges
      out = [];
      quad.retrieve_ydec(49,8,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(3));
      out = [];
      quad.retrieve_ydec(49,6,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(4));
      out = [];
      quad.retrieve_ydec(49,4,1,function(c) { out.push(c); });
      expect(out).toEqual(items.slice(5));
      out = [];
      quad.retrieve_ydec(49,2,1,function(c) { out.push(c); });
      expect(out).toEqual([]);
      
      // Put items back into forward order
      items.reverse();
    }
    
    
    it('iterate x alone', test_iterate_y_tests);
    // Add a number of objects
    for(var i=0; i<100; i += 5) {
      quad.insert({x:i/20, y:i, width:1, height:1});
    }
    // Adding the objects above should not have changed the test
    it('iterate x with objs', test_iterate_y_tests);
    for(i=0; i<100; i += 5) {
      quad.insert({x:99-i/20, y:99-i, width:1, height:1});
    }
    it('iterate x with more objs', test_iterate_y_tests);
    
  });
  describe('Quadtree Var Size Iteration', function () {
    it('X Direc', function () {
      var quad = new QuadTree(bounds);
      var items = [
        {y:1,x:10, width:30, height:2, id:0},
        {y:1,x:2, width:80, height:2, id:1},
      ];
      quad.insert(items);
      quad.retrieve_xinc(0,0,50,function(c) {
        expect(c.id).toEqual(1);
        return false;
      });
      quad.retrieve_xdec(100,0,50,function(c) {
        expect(c.id).toEqual(1);
        return false;
      });
    });
    it('X Direc - Multiquads', function () {
      var quad = new QuadTree(bounds);
      var items = [
        {y:1,x:10, width:30, height:2, id:0},
        {y:1,x:2, width:80, height:2, id:1},
        {y:3,x:10, width:30, height:2, id:2},
        {y:4,x:10, width:30, height:2, id:3},
      ];
      quad.insert(items);
      quad.retrieve_xinc(0,0,50,function(c) {
        expect(c.id).toEqual(1);
        return false;
      });
      quad.retrieve_xdec(100,0,50,function(c) {
        expect(c.id).toEqual(1);
        return false;
      });
    });
    it('Y Direc', function () {
      var quad = new QuadTree(bounds);
      var items = [
        {x:1,y:10, width:2, height:30, id:0},
        {x:1,y:2, width:2, height:80, id:1},
      ];
      quad.insert(items);
      quad.retrieve_yinc(0,0,50,function(c) {
        expect(c.id).toEqual(1);
        return false;
      });
      quad.retrieve_ydec(0,100,50,function(c) {
        expect(c.id).toEqual(1);
        return false;
      });
    });
  });
  describe('Other Exmaples', function () {
    var quad = new QuadTree({x:0,y:0,width:350, height:500});
    var items = [
      {x:327.50, y:226.06, width:3.74, height:14.96, id:0},
      {x:321.85, y:243.27, width:14.98, height:14.96, id:1},
    ];
    quad.insert(items);
    var ct = 0;
    quad.retrieve_yinc(327.50, 226.06, 3.74, function (c) {
      if (ct === 0) {
        expect(c.id).toEqual(0);
        ct ++;
      } else if (ct === 1) {
        expect(c.id).toEqual(1);
        ct ++;
      } else {
        expect(true).toEqual(false);
      }
    });
    expect(ct).toEqual(2);
  });
});
