
var PermalinkControl = L.Control.extend({
  "onAdd": function(map) {
    var e_root = L.DomUtil.create("div");
    var e_main = L.DomUtil.create("div");
    e_root.appendChild(e_main);
    e_main.className = "permalink-root";
    this._e_href = L.DomUtil.create("a");
    e_main.appendChild(this._e_href);
    L.DomEvent.on(e_root, "click", L.DomEvent.stopPropagation, this);
    this._e_href.target = "_blank";
    this._e_href.innerText = "Permalink";
    this.href("");
    return e_root;
  },
  "onRemove": function(map) {
    this._e_href = null;
  },
  "href": function(v) {
    if( arguments && arguments.length > 0 ) {
      // setter
      if( this._e_href ) {
        if( v == "" ) {
          this._e_href.href = "javascript:void(0)";
          this._e_href.target = "";
        }
        else {
          this._e_href.href = v;
          this._e_href.target = "_blank";
        }
      }
      return this;
    }
    // getter
    return this._e_href ? this._e_href.href : null;
  },
});

var DemGetControl = L.Control.extend({
  "_opened": function(v) {
    if( arguments && arguments.length > 0 ) {
      // setter
      if( this.e_main ) {
        this.e_main.style.display = v ? "block" : "none";
      }
      if( this.e_toggle ) {
        // clear
        this.e_toggle.innerText = "";
        this.e_toggle.appendChild(v ? this._svg_tdown : this._svg_tup);
        // this.e_toggle.innerText = v ? "閉じる" : "開く";
      }
      return this;
    }
    // getter
    return this.e_main && this.e_main && this.e_main.style.display == "block";
  },
  "_toggle": function() {
    this._opened(!this._opened());
  },
  "onAdd": function(map) {
    var e_root = L.DomUtil.create("div");
    e_root.style.position = "relative";
    // toggle button
    this.e_toggle = L.DomUtil.create("button");
    this.e_toggle.className = "domgetcontrol-toggle";
    e_root.appendChild(this.e_toggle);
    // toggle button css
    L.DomEvent.on(this.e_toggle, "click", this._toggle, this);
    // toggle images
    this._svg_tup = BO.createInlineSvg(BO.icons["tup"]);
    this._svg_tdown = BO.createInlineSvg(BO.icons["tdown"]);
    // main
    this.e_main = L.DomUtil.create("div");
    e_root.appendChild(this.e_main);
    //
    this.e_main.className = "domgetcontrol-root";
    L.DomEvent.on(e_root, "mousedown", L.DomEvent.stopPropagation);
    L.DomEvent.on(e_root, "click", L.DomEvent.stopPropagation);
    L.DomEvent.on(e_root, "dblclick", L.DomEvent.stopPropagation);
    // anchor
    var e_table = L.DomUtil.create("table");
    this.e_main.appendChild(e_table);
    var e_tbody = L.DomUtil.create("tbody");
    e_table.appendChild(e_tbody);
    var anchors = [["左上", "上", "右上"],["左", "中心", "右"],["左下", "下", "右下"]];
    this._e_anchors = [[],[],[]];
    for( var nr = 0; nr < 3; nr++ ) {
      var e_tr = L.DomUtil.create("tr");
      e_tbody.appendChild(e_tr);
      for( var nc = 0; nc < 3; nc++ ) {
        var e_td = L.DomUtil.create("td");
        e_tr.appendChild(e_td);
        this._e_anchors[nr][nc] = L.DomUtil.create("input");
        // sets dom event handlers
        L.DomEvent.on(this._e_anchors[nr][nc], "change", this._bounds_changed, this);
        L.DomEvent.on(this._e_anchors[nr][nc], "click", function(ev) {
           L.DomEvent.stopPropagation(ev);
        }, this);
        // appends
        e_tr.appendChild(this._e_anchors[nr][nc]);
        this._e_anchors[nr][nc].type = "radio";
        this._e_anchors[nr][nc].name = "anchor";
        this._e_anchors[nr][nc].value = anchors[nr][nc];
      }
    }
    // point
    e_div = L.DomUtil.create("div");
    e_div.className = "domgetcontrol-div";
    this.e_main.appendChild(e_div);
    // point/label
    var e_span = L.DomUtil.create("span");
    e_div.append(e_span);
    e_span.innerText = "位置";
    // point/lon/input
    this._e_lon = L.DomUtil.create("input");
    this._e_lon.size = "12";
    this._setonchange(this._e_lon);
    this._e_lon.type = "text";
    e_div.appendChild(this._e_lon);
    // point/lat/input
    this._e_lat = L.DomUtil.create("input");
    this._e_lat.size = "12";
    this._setonchange(this._e_lat);
    this._e_lat.type = "text";
    e_div.appendChild(this._e_lat);
    // cells
    e_div = L.DomUtil.create("div");
    e_div.className = "domgetcontrol-div";
    this.e_main.appendChild(e_div);
    // cells/lon/label
    var e_span = L.DomUtil.create("span");
    e_div.append(e_span);
    e_span.innerText = "セル横";
    // cells/lon/input
    this._e_cols = L.DomUtil.create("input");
    this._e_cols.className = "domgetcontrol-input-cells";
    this._e_cols.size = "5";
    this._setonchange(this._e_cols);
    this._e_cols.type = "number";
    e_div.appendChild(this._e_cols);
    // cells/lat/label
    var e_span = L.DomUtil.create("span");
    e_div.append(e_span);
    e_span.innerText = "縦";
    // rows
    this._e_rows = L.DomUtil.create("input");
    this._e_rows.className = "domgetcontrol-input-cells";
    this._e_rows.size = "5";
    this._setonchange(this._e_rows);
    this._e_rows.type = "number";
    e_div.appendChild(this._e_rows);
    // buttons
    e_div = L.DomUtil.create("div");
    e_div.className = "domgetcontrol-div-button";
    this.e_main.appendChild(e_div);
    // 取得
    var e_button = L.DomUtil.create("button");
    e_button.innerText = "取得";
    e_div.appendChild(e_button);
    L.DomEvent.on(e_button, "click", function(ev) {
      L.DomEvent.preventDefault(ev);
      L.DomEvent.stopPropagation(ev);
      this.fire("button_clicked");
    }, this);
    // 再描画
    var e_button = L.DomUtil.create("button");
    e_button.innerText = "再描画";
    e_div.appendChild(e_button);
    L.DomEvent.on(e_button, "click", function(ev) {
      L.DomEvent.preventDefault(ev);
      L.DomEvent.stopPropagation(ev);
      this.remakeBounds();
      this.moveToBounds();
    }, this);
    // クリア
    e_button = L.DomUtil.create("button");
    e_div.appendChild(e_button);
    e_button.innerText = "消去";
    L.DomEvent.on(e_button, "click", function(ev) {
      L.DomEvent.preventDefault(ev);
      L.DomEvent.stopPropagation(ev);
      this.clear();
    }, this);
    // attribution
    e_div = L.DomUtil.create("div");
    this.e_main.appendChild(e_div);
    var e_link = L.DomUtil.create("a");
    e_link.href = "https://boiledorange73.sakura.ne.jp/dem.html";
    e_link.target = "_blank";
    e_link.innerText = "基盤地図情報DEM配信サービス";
    e_div.appendChild(e_link);
     // closes main
    this._opened(true);
    // icon
    this._icon_sight = L.icon({
      "iconUrl": "sight.svg",
      "iconSize": [32, 32],
      "iconAnchor": [16, 16]
    });
    // fin
    return e_root;
  },
  "onRemove": function(map) {
    this.e_main = null;
    this.e_toggle = null;
    this._e_lon = null;
    this._e_lat = null;
    this._e_cols = null;
    this._e_rows = null;
    this._evented = null;
    this._removebounds();
    this._icon_sight = null;
  },
  "clear": function() {
    this.anchor([0,0]);
    this._e_lon.value = "";
    this._e_lat.value = "";
    this._e_cols.value = "";
    this._e_rows.value = "";
    this._bounds_changed();
  },
  "_setonchange": function(e) {
    L.DomEvent.on( e, "change", this._bounds_changed, this);
    L.DomEvent.on( e, "click", function(ev) {
        L.DomEvent.preventDefault(ev);
        L.DomEvent.stopPropagation(ev);
    }, this);
  },
  "getBounds": function() {
      var lonlat = this.lonlat();
      var anchor = this.anchor();
      var cells = this.cells();
      if( !lonlat || !anchor || !cells ) {
        return null;
      }
      // deg/cell = 0.4sec = 0.4/3600[deg] = 4/9000
      // cell/deg = 2250
      // lon*(cell/deg) [cell]
      var lon_cut = Math.floor(lonlat.lon * 2250.0)/2250.0;
      var lat_cut = Math.floor(lonlat.lat * 2250.0)/2250.0;
      var dlon = cells.cols * 0.4 / 3600.0;
      var dlat = cells.rows * 0.4 / 3600.0;
      var lllat, lllon;
      // lon
      if( anchor[0] < 0 ) { // left
        lllon = lon_cut;
      }
      else if( anchor[0] > 0 ) { // right
        lllon = lon_cut - dlon;
      }
      else { // center
        lllon = lon_cut - 0.5 * dlon;
      }
      // lat
      if( anchor[1] < 0 ) { // left
        lllat = lat_cut;
      }
      else if( anchor[1] > 0 ) { // right
        lllat = lat_cut - dlat;
      }
      else { // center
        lllat = lat_cut - 0.5 * dlat;
      }
      // border
      return [{"lon": lllon, "lat": lllat}, {"lon": lllon + dlon, "lat": lllat + dlat}];
  },
  "_removebounds": function() {
    if( this._pin ) {
      this._pin.remove();
      this._pin = null;
    }
    if( this._bounds_poly ) {
      this._bounds_poly.remove();
      this._bounds_poly = null;
    }
  },
  "_addbounds": function() {
    // adds
    var bbox = this.getBounds();
    if( bbox ) {
      this._bounds_poly = L.rectangle(
        [[bbox[0].lat, bbox[0].lon], [bbox[1].lat, bbox[1].lon]],
        {"interactive": false, "color": "#F00", "width": 1});
      this._bounds_poly.addTo(this._map);
    }
    var lonlat = this.lonlat();
    if( lonlat ) {
      this._pin = L.marker(
        [lonlat.lat, lonlat.lon],
        {
          "icon": this._icon_sight,
          "draggable": true
        }
      ).addTo(this._map);
      this._pin.on(
        "dragend",
        function(e) {
          var latlng = e && e.target ? e.target.getLatLng() : null;
          if( latlng ) {
            this.lonlat({"lon": latlng.lng, "lat": latlng.lat});
          }
        },
        this
      );
    }
  },


  "remakeBounds": function() {
    this._removebounds();
    this._addbounds();
  },
  "moveToBounds": function() {
    var b = this.getBounds();
    if( b ) {
      // adds some padding
      var wpad = 0.5*(b[1].lon-b[0].lon);
      var hpad = 0.5*(b[1].lat-b[0].lat);
      var b1 = [[b[0].lat-hpad,b[0].lon-wpad],[b[1].lat+hpad,b[1].lon+wpad]];
      this._map.fitBounds(b1);
    }
  },
  "_bounds_changed": function() {
    // remakes bounds
    this.remakeBounds();
    var bounds = this.getBounds();
    this.fire("bounds_changed", {"bounds": bounds});
  },
  "getParams": function() {
    var ret = {};
    // lon,lat,zoom
    if( this._e_lat.value > 0 && this._e_lon.value > 0 ) {
      ret.plon = parseFloat(this._e_lon.value);
      ret.plat = parseFloat(this._e_lat.value);
    }
    if( this._e_rows.value > 0 && this._e_cols.value > 0 ) {
      ret.rows = parseInt(this._e_rows.value);
      ret.cols = parseInt(this._e_cols.value);
    }
    // anchor
    ret["anc"] = this.anchorText();
    return ret;
  },
  "anchor": function(v) {
    if( arguments && arguments.length > 0 ) {
      // setter
      if( Object.prototype.toString.call(v) === "[object Array]" ) {
        if( v.length >= 2 && v[0] >= -1 && v[0] <= 1 && v[1] >= -1 && v[1] <= 1 ) {
          this._e_anchors[2-(v[1]+1)][v[0]+1].checked = true;
        }
      }
      return this;
    }
    // getter
    for( var nr = 0; nr < 3; nr++ ) {
      for( var nc = 0; nc < 3; nc++ ) {
        var e = this._e_anchors[2-nr][nc];
        if( e.checked ) {
          return [nc-1, nr-1];
        }
      }
    }
    return [0,0];
  },
  "anchorText": function(v) {
    if( arguments && arguments.length > 0 ) {
      // setter
      var ia = [0,0];
      switch((""+v).toLowerCase()) {
        case "ul":
        ia = [-1,1];
        break;
      case "uc":
        ia = [0,1];
        break;
      case "ur":
        ia = [1,1];
        break;
      case "cl":
        ia = [-1,0];
        break;
      case "cc":
        ia = [0,0];
        break;
      case "cr":
        ia = [1,0];
        break;
      case "ll":
        ia = [-1,-1];
        break;
      case "lc":
        ia = [0,-1];
        break;
      case "lr":
        ia = [1,-1];
        break;
      }
      return this.anchor(ia);
    }
    // getter
    var ret = "cc";
    var nums = this.anchor();
    if( nums && nums.length >= 2 ) {
      switch(nums[0]) {
      case -1:
        ret = ret[0] + "l";
        break;
      case 1:
        ret = ret[0] + "r";
        break;
      }
      switch(nums[1]) {
      case -1:
        ret = "l" + ret[1];
        break;
      case 1:
        ret = "u" + ret[1];
        break;
      }
    }
    return ret;
  },
  "cells": function(v) {
    if( arguments && arguments.length > 0 ) {
      // setter
      if( v && v.cols > 0 && v.rows > 0 ) {
        this._e_cols.value = v.cols;
        this._e_rows.value = v.rows;
        this._bounds_changed();
      }
      return this;
    }
    // getter
    var cols = this._e_cols.value;
    var rows = this._e_rows.value;
    if( cols > 0 && rows > 0 ) {
      return {"cols": cols, "rows": rows};
    }
    return null;
  },
  "lonlat": function(v) {
    if( arguments && arguments.length > 0 ) {
      // setter
      if( v && v.lon > 0 && v.lon < 180 && v.lat > 0 && v.lat < 90 ) {
        this._e_lon.value = v.lon;
        this._e_lat.value = v.lat;
        this._bounds_changed();
      }
      return this;
    }
    // getter
    var lon = this._e_lon.value;
    var lat = this._e_lat.value;
    if( lon > 0 && lon < 180 && lat > 0 && lat < 90 ) {
      return {"lon": lon, "lat": lat};
    }
    return null;
  },
  "on": function on(type, fn, context) {
    if( !this._evented ) {
      this._evented = new L.Evented();
    }
    return this._evented.on(type, fn, context);
  },
  "off": function off(type, fn, context) {
    if( this._evented ) {
      return this._evented.off(type, fn, context);
    }
    return this;
  },
  "fire": function on(type, data, propagate) {
    if( this._evented ) {
      return this._evented.fire(type, data, propagate);
    }
    return this;
  },
});



window.addEventListener("load", function() {
  // lat,lon,rows,cols,anc[uml,lcr],plat,plon
  var ipos = {"lon": 135, "lat": 35, "zoom": 6}, ir = "", ic = "", ia = "cc", ip = null;
  var urlParams = new URLSearchParams(window.location.search);
  if( urlParams.has("lat") && urlParams.has("lon") ) {
    ipos.lon = parseFloat(urlParams.get("lon"));
    ipos.lat = parseFloat(urlParams.get("lat"));
    if( urlParams.has("zoom") ) {
     ipos.zoom = parseInt(urlParams.get("zoom"));
    }
  }
  if( urlParams.has("plon") && urlParams.has("plat") ) {
    ip = {"lon": parseFloat(urlParams.get("plon")), "lat": parseFloat(urlParams.get("plat"))};
  }
  if( urlParams.has("cols") ) {
    ic = parseInt(urlParams.get("cols"));
  }
  if( urlParams.has("rows") ) {
    ir = parseInt(urlParams.get("rows"));
  }
  if( urlParams.has("anc") ) {
    ia = urlParams.get("anc");
  }
  // creates a map
  var map = L.map("MAP");
  // onchange layers
  var layername = null;
  map.on("baselayerchange", function(e) {
    layername = e.name;
    changePermalink();
  });
  if( ipos ) {
    map.setView([ipos.lat,ipos.lon], ipos.zoom);
  }
  var rectangle = null;
  var baselayers = {
    "地図": L.tileLayer(
      "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
        "name": "地図",
        "maxZoom": 20,
        "maxNativeZoom": 18,
        "attribution": "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\">地理院地図</a>"
      }
    ),
    "空中写真": L.tileLayer(
      "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", {
        "name": "空中写真",
        "maxZoom": 20,
        "maxNativeZoom": 18,
        "attribution": "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\">地理院地図</a>"
      }
    )
  };
  if( urlParams.has("lyr") && urlParams.get("lyr") in baselayers ) {
    baselayers[urlParams.get("lyr")].addTo(map);
  }
  else {
    baselayers["地図"].addTo(map);
  }
  L.control.layers(baselayers).addTo(map);
  //
  var permalink = (new PermalinkControl({"position": "bottomleft"}));
  permalink.addTo(map);
  var demget = (new DemGetControl({"position": "bottomleft"}));
  demget.addTo(map);
  //
  // init
  demget.anchorText(ia);
  demget.cells({"cols": ic, "rows": ir});
  if( ip ) {
    demget.lonlat(ip);
  }
  demget.on("button_clicked", function(ev) {
    demget.remakeBounds();
    var bounds = demget.getBounds();
    var cells = demget.cells();
    if( !cells || !(cells.rows > 0) || !(cells.cols > 0)) {
      return;
    }
    if( cells.rows > 1000 || cells.cols > 1000 ) {
      alert("セル数は、縦横とも1000以下にしてください");
      return;
    }
    if( bounds ) {
      var cells = demget.cells();
      var url = "http://boiledorange73.sakura.ne.jp/cgi-bin/mapserv.cgi?map=wcs&" +
        "SERVICE=WCS&VERSION=1.0.0&REQUEST=GetCoverage&FORMAT=GTiff&" + 
        "COVERAGE=dem10b&" + 
        "BBOX="+bounds[0].lon+","+bounds[0].lat+","+bounds[1].lon+","+bounds[1].lat + "&" +
        "CRS=EPSG:4612&RESPONSE_CRS=EPSG:4612&" +
        "WIDTH="+cells.cols+"&HEIGHT="+cells.rows;
      window.open(url, "_blank");
    }
  });
  // permalink
  var changePermalink = function () {
    var params = demget.getParams();
    if( !params ) {
      params = {};
    }
    var latlng = map.getCenter();
    params["lon"] = latlng.lng;
    params["lat"] = latlng.lat;
    params["zoom"] = map.getZoom();
    //
    if( layername != null ) {
      params["lyr"] = layername;
    }
    //
    var urlbody = window.location.href;
    urlbody = urlbody.replace(location.search , '');
    //
    var urlparams = "";
    var delim = "";
    for(var k in params ) {
      urlparams = urlparams + delim + encodeURI(k) + "=" + encodeURI(params[k]);
      delim = "&";
    }
    permalink.href(urlbody+"?"+urlparams);
  };
  // map -> permalink
  map.on("zoomend", changePermalink);
  map.on("moveend", changePermalink);
  //
  demget.on("bounds_changed", changePermalink);
  map.on("click", function(e) {
    if( e ) {
      if( e.latlng ) {
        demget.lonlat({"lon": e.latlng.lng, "lat": e.latlng.lat});
      }
      resetPin(e.latlng);
    }
    /*
    */
  });
  // rows, cols
  if( !demget.cells() ) {
    demget.cells({"cols": 200, "rows": 200});
  }
  // permalink
  changePermalink();
});

