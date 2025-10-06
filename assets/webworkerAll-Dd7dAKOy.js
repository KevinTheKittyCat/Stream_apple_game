import{E as p,g as ze,T as N,x as w,p as ae,J as v,_ as y,ag as se,L as E,M as T,w as ne,Z as ie,S as R,X as M,an as ke,ao as Y,ad as W,ae as We,ap as X,a1 as I,aq as C,o as j,n as S,I as H,V as Ie,Q as Oe,aa as Ve,ar as O,z as oe,H as ue,ai as le,al as de,A as Le,G as Ee,aj as Ye,ak as Xe,am as He,as as qe,at as $e,au as Ne,av as V,aw as je,ax as Qe,D as ce,y as he,ay as Ke,az as Je,aA as Ze,aB as Q,aC as G,i as b,aD as et}from"./index--aJ9Cq8q.js";import{c as F,a as tt,b as rt,B as fe}from"./colorToUniform-BXaCBwVl.js";class pe{static init(e){Object.defineProperty(this,"resizeTo",{set(t){globalThis.removeEventListener("resize",this.queueResize),this._resizeTo=t,t&&(globalThis.addEventListener("resize",this.queueResize),this.resize())},get(){return this._resizeTo}}),this.queueResize=()=>{this._resizeTo&&(this._cancelResize(),this._resizeId=requestAnimationFrame(()=>this.resize()))},this._cancelResize=()=>{this._resizeId&&(cancelAnimationFrame(this._resizeId),this._resizeId=null)},this.resize=()=>{if(!this._resizeTo)return;this._cancelResize();let t,r;if(this._resizeTo===globalThis.window)t=globalThis.innerWidth,r=globalThis.innerHeight;else{const{clientWidth:a,clientHeight:s}=this._resizeTo;t=a,r=s}this.renderer.resize(t,r),this.render()},this._resizeId=null,this._resizeTo=null,this.resizeTo=e.resizeTo||null}static destroy(){globalThis.removeEventListener("resize",this.queueResize),this._cancelResize(),this._cancelResize=null,this.queueResize=null,this.resizeTo=null,this.resize=null}}pe.extension=p.Application;class me{static init(e){e=Object.assign({autoStart:!0,sharedTicker:!1},e),Object.defineProperty(this,"ticker",{set(t){this._ticker&&this._ticker.remove(this.render,this),this._ticker=t,t&&t.add(this.render,this,ze.LOW)},get(){return this._ticker}}),this.stop=()=>{this._ticker.stop()},this.start=()=>{this._ticker.start()},this._ticker=null,this.ticker=e.sharedTicker?N.shared:new N,e.autoStart&&this.start()}static destroy(){if(this._ticker){const e=this._ticker;this.ticker=null,e.destroy()}}}me.extension=p.Application;class ge{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}ge.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"filter"};function at(i,e){e.clear();const t=e.matrix;for(let r=0;r<i.length;r++){const a=i[r];a.globalDisplayStatus<7||(e.matrix=a.worldTransform,e.addBounds(a.bounds))}return e.matrix=t,e}const st=new se({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:2*4,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class nt{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new ie,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.outputOffset={x:0,y:0},this.globalFrame={x:0,y:0,width:0,height:0}}}class xe{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new w({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new ae({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,a=this._pushFilterData();a.skip=!1,a.filters=r,a.container=e.container,a.outputRenderSurface=t.renderTarget.renderSurface;const s=t.renderTarget.renderTarget.colorTexture.source,n=s.resolution,o=s.antialias;if(r.length===0){a.skip=!0;return}const u=a.bounds;if(e.renderables?at(e.renderables,u):e.filterEffect.filterArea?(u.clear(),u.addRect(e.filterEffect.filterArea),u.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,u),e.container){const m=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;m&&u.applyMatrix(m)}if(this._calculateFilterBounds(a,t.renderTarget.rootViewPort,o,n,1),a.skip)return;const d=this._getPreviousFilterData();let h=n,l=0,c=0;d&&(l=d.bounds.minX,c=d.bounds.minY,h=d.inputTexture.source._resolution),a.outputOffset.x=u.minX-l,a.outputOffset.y=u.minY-c;const f=a.globalFrame;if(f.x=l*h,f.y=c*h,f.width=s.width*h,f.height=s.height*h,a.backTexture=v.EMPTY,a.blendRequired){t.renderTarget.finishRenderPass();const x=t.renderTarget.getRenderTarget(a.outputRenderSurface);a.backTexture=this.getBackTexture(x,u,d==null?void 0:d.bounds)}a.inputTexture=y.getOptimalTexture(u.width,u.height,a.resolution,a.antialias),t.renderTarget.bind(a.inputTexture,!0),t.globalUniforms.push({offset:u})}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const a=e.source,s=a.resolution,n=a.antialias;if(t.length===0)return r.skip=!0,e;const o=r.bounds;if(o.addRect(e.frame),this._calculateFilterBounds(r,o.rectangle,n,s,0),r.skip)return e;const u=s,d=0,h=0;r.outputOffset.x=-o.minX,r.outputOffset.y=-o.minY;const l=r.globalFrame;l.x=d*u,l.y=h*u,l.width=a.width*u,l.height=a.height*u,r.outputRenderSurface=y.getOptimalTexture(o.width,o.height,r.resolution,r.antialias),r.backTexture=v.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const f=r.outputRenderSurface;return f.source.alphaMode="premultiplied-alpha",f}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&y.returnTexture(t.backTexture),y.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const a=e.colorTexture.source._resolution,s=y.getOptimalTexture(t.width,t.height,a,!1);let n=t.minX,o=t.minY;r&&(n-=r.minX,o-=r.minY),n=Math.floor(n*a),o=Math.floor(o*a);const u=Math.ceil(t.width*a),d=Math.ceil(t.height*a);return this.renderer.renderTarget.copyToTexture(e,s,{x:n,y:o},{width:u,height:d},{x:0,y:0}),s}applyFilter(e,t,r,a){const s=this.renderer,n=this._activeFilterData,o=n.outputRenderSurface,u=this._filterGlobalUniforms,d=u.uniforms,h=d.uOutputFrame,l=d.uInputSize,c=d.uInputPixel,f=d.uInputClamp,x=d.uGlobalFrame,m=d.uOutputTexture;o===r?(h[0]=n.outputOffset.x,h[1]=n.outputOffset.y):(h[0]=0,h[1]=0),h[2]=t.frame.width,h[3]=t.frame.height,l[0]=t.source.width,l[1]=t.source.height,l[2]=1/l[0],l[3]=1/l[1],c[0]=t.source.pixelWidth,c[1]=t.source.pixelHeight,c[2]=1/c[0],c[3]=1/c[1],f[0]=.5*c[2],f[1]=.5*c[3],f[2]=t.frame.width*l[2]-.5*c[2],f[3]=t.frame.height*l[3]-.5*c[3],x[0]=n.globalFrame.x,x[1]=n.globalFrame.y,x[2]=n.globalFrame.width,x[3]=n.globalFrame.height,r instanceof v&&(r.source.resource=null);const g=this.renderer.renderTarget.getRenderTarget(r);if(s.renderTarget.bind(r,!!a),r instanceof v?(m[0]=r.frame.width,m[1]=r.frame.height):(m[0]=g.width,m[1]=g.height),m[2]=g.isRoot?-1:1,u.update(),s.renderPipes.uniformBatch){const _=s.renderPipes.uniformBatch.getUboResource(u);this._globalFilterBindGroup.setResource(_,0)}else this._globalFilterBindGroup.setResource(u,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,s.encoder.draw({geometry:st,shader:e,state:e._state,topology:"triangle-list"}),s.type===E.WEBGL&&s.renderTarget.finishRenderPass()}calculateSpriteMatrix(e,t){const r=this._activeFilterData,a=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),s=t.worldTransform.copyTo(T.shared),n=t.renderGroup||t.parentRenderGroup;return n&&n.cacheToLocalTransform&&s.prepend(n.cacheToLocalTransform),s.invert(),a.prepend(s),a.scale(1/t.texture.frame.width,1/t.texture.frame.height),a.translate(t.anchor.x,t.anchor.y),a}destroy(){}_applyFiltersToTexture(e,t){const r=e.inputTexture,a=e.bounds,s=e.filters;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),s.length===1)s[0].apply(this,r,e.outputRenderSurface,t);else{let n=e.inputTexture;const o=y.getOptimalTexture(a.width,a.height,n.source._resolution,!1);let u=o,d=0;for(d=0;d<s.length-1;++d){s[d].apply(this,n,u,!0);const l=n;n=u,u=l}s[d].apply(this,n,e.outputRenderSurface,t),y.returnTexture(o)}}_calculateFilterBounds(e,t,r,a,s){var m;const n=this.renderer,o=e.bounds,u=e.filters;let d=1/0,h=0,l=!0,c=!1,f=!1,x=!0;for(let g=0;g<u.length;g++){const _=u[g];if(d=Math.min(d,_.resolution==="inherit"?a:_.resolution),h+=_.padding,_.antialias==="off"?l=!1:_.antialias==="inherit"&&l&&(l=r),_.clipToViewport||(x=!1),!!!(_.compatibleRenderers&n.type)){f=!1;break}if(_.blendRequired&&!(((m=n.backBuffer)==null?void 0:m.useBackBuffer)??!0)){ne("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),f=!1;break}f=_.enabled||f,c||(c=_.blendRequired)}if(!f){e.skip=!0;return}if(x&&o.fitBounds(0,t.width/a,0,t.height/a),o.scale(d).ceil().scale(1/d).pad((h|0)*s),!o.isPositive){e.skip=!0;return}e.antialias=l,e.resolution=d,e.blendRequired=c}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>1&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new nt),this._filterStackIndex++,e}}xe.extension={type:[p.WebGLSystem,p.WebGPUSystem],name:"filter"};class it{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{M.return(e)}),this.batches.length=0}}class _e{constructor(e,t){this.state=R.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,a=this.renderer.graphicsContext.updateGpuContext(t);return!!(a.isBatchable||r!==a.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let a=0;a<r.length;a++){const s=r[a];s._batcher.updateElement(s)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const s=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const n=s.resources.localUniforms.uniforms;n.uTransformMatrix=e.groupTransform,n.uRound=t._roundPixels|e._roundPixels,F(e.groupColorAlpha,n.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,a=this._getGpuDataForRenderable(e).batches;for(let s=0;s<a.length;s++){const n=a[s];r.addToBatch(n,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new it;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,a=this.renderer.graphicsContext.getGpuContext(r),s=this.renderer._roundPixels|e._roundPixels;t.batches=a.batches.map(n=>{const o=M.get(ke);return n.copyTo(o),o.renderable=e,o.roundPixels=s,o})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}_e.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"graphics"};const be=class ye extends Y{constructor(...e){super({});let t=e[0]??{};typeof t=="number"&&(W(We,"PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead"),t={width:t,height:e[1],verticesX:e[2],verticesY:e[3]}),this.build(t)}build(e){e={...ye.defaultOptions,...e},this.verticesX=this.verticesX??e.verticesX,this.verticesY=this.verticesY??e.verticesY,this.width=this.width??e.width,this.height=this.height??e.height;const t=this.verticesX*this.verticesY,r=[],a=[],s=[],n=this.verticesX-1,o=this.verticesY-1,u=this.width/n,d=this.height/o;for(let l=0;l<t;l++){const c=l%this.verticesX,f=l/this.verticesX|0;r.push(c*u,f*d),a.push(c/n,f/o)}const h=n*o;for(let l=0;l<h;l++){const c=l%n,f=l/n|0,x=f*this.verticesX+c,m=f*this.verticesX+c+1,g=(f+1)*this.verticesX+c,_=(f+1)*this.verticesX+c+1;s.push(x,m,g,m,_,g)}this.buffers[0].data=new Float32Array(r),this.buffers[1].data=new Float32Array(a),this.indexBuffer.data=new Uint32Array(s),this.buffers[0].update(),this.buffers[1].update(),this.indexBuffer.update()}};be.defaultOptions={width:100,height:100,verticesX:10,verticesY:10};let ot=be;class q{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let a=r;const s=this.texture.textureMatrix;return s.isSimple||(a=this._transformedUvs,(this._textureMatrixUpdateId!==s._updateID||this._uvUpdateId!==t._updateID)&&((!a||a.length<r.length)&&(a=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=s._updateID,this._uvUpdateId=t._updateID,s.multiplyUvs(r,a))),a}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class K{destroy(){}}class Te{constructor(e,t){this.localUniforms=new w({uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new ae({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,a=e.batched;if(t.batched=a,r!==a)return!0;if(a){const s=e._geometry;if(s.indices.length!==t.indexSize||s.positions.length!==t.vertexSize)return t.indexSize=s.indices.length,t.vertexSize=s.positions.length,!0;const n=this._getBatchableMesh(e);return n.texture.uid!==e._texture.uid&&(n._textureMatrixUpdateId=-1),!n._batcher.checkAndUpdateTexture(n,e._texture)}return!1}addRenderable(e,t){const r=this.renderer.renderPipes.batch,{batched:a}=this._getMeshData(e);if(a){const s=this._getBatchableMesh(e);s.setTexture(e._texture),s.geometry=e._geometry,r.addToBatch(s,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=X(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),F(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new K),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){var t,r;return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:(t=e._geometry.indices)==null?void 0:t.length,vertexSize:(r=e._geometry.positions)==null?void 0:r.length},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new K),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new q;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}Te.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"mesh"};class ut{execute(e,t){const r=e.state,a=e.renderer,s=t.shader||e.defaultShader;s.resources.uTexture=t.texture._source,s.resources.uniforms=e.localUniforms;const n=a.gl,o=e.getBuffers(t);a.shader.bind(s),a.state.set(r),a.geometry.bind(o.geometry,s.glProgram);const d=o.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?n.UNSIGNED_SHORT:n.UNSIGNED_INT;n.drawElements(n.TRIANGLES,t.particleChildren.length*6,d,0)}}class lt{execute(e,t){const r=e.renderer,a=t.shader||e.defaultShader;a.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),a.groups[1]=r.texture.getTextureBindGroup(t.texture);const s=e.state,n=e.getBuffers(t);r.encoder.draw({geometry:n.geometry,shader:t.shader||e.defaultShader,state:s,size:t.particleChildren.length*6})}}function J(i,e=null){const t=i*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,a=0;r<t;r+=6,a+=4)e[r+0]=a+0,e[r+1]=a+1,e[r+2]=a+2,e[r+3]=a+0,e[r+4]=a+2,e[r+5]=a+3;return e}function dt(i){return{dynamicUpdate:Z(i,!0),staticUpdate:Z(i,!1)}}function Z(i,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const s in i){const n=i[s];if(e!==n.dynamic)continue;t.push(`offset = index + ${r}`),t.push(n.code);const o=I(n.format);r+=o.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const a=t.join(`
`);return new Function("ps","f32v","u32v",a)}class ct{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let a=0,s=0;for(const h in r){const l=r[h],c=I(l.format);l.dynamic?s+=c.stride:a+=c.stride}this._dynamicStride=s/4,this._staticStride=a/4,this.staticAttributeBuffer=new C(t*4*a),this.dynamicAttributeBuffer=new C(t*4*s),this.indexBuffer=J(t);const n=new se;let o=0,u=0;this._staticBuffer=new j({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:S.VERTEX|S.COPY_DST}),this._dynamicBuffer=new j({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:S.VERTEX|S.COPY_DST});for(const h in r){const l=r[h],c=I(l.format);l.dynamic?(n.addAttribute(l.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:o*4,format:l.format}),o+=c.size):(n.addAttribute(l.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:u*4,format:l.format}),u+=c.size)}n.addIndex(this.indexBuffer);const d=this.getParticleUpdate(r);this._dynamicUpload=d.dynamicUpdate,this._staticUpload=d.staticUpdate,this.geometry=n}getParticleUpdate(e){const t=ht(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return dt(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new C(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new C(this._size*this._dynamicStride*4*4),this.indexBuffer=J(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const a=this.staticAttributeBuffer;this._staticUpload(e,a.float32View,a.uint32View),this._staticBuffer.setDataWithSize(a.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function ht(i){const e=[];for(const t in i){const r=i[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var ft=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,pt=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,ee=`
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class mt extends H{constructor(){const e=Ie.from({vertex:pt,fragment:ft}),t=Oe.from({fragment:{source:ee,entryPoint:"mainFragment"},vertex:{source:ee,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:v.WHITE.source,uSampler:new O({}),uniforms:{uTranslationMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Ve(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class ve{constructor(e,t){this.state=R.for2d(),this.localUniforms=new w({uTranslationMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new mt,this.state=R.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new ct({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,a=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const s=this.state;a.update(t,e._childrenDirty),e._childrenDirty=!1,s.blendMode=X(e.blendMode,e.texture._source);const n=this.localUniforms.uniforms,o=n.uTranslationMatrix;e.worldTransform.copyTo(o),o.prepend(r.globalUniforms.globalUniformData.projectionMatrix),n.uResolution=r.globalUniforms.globalUniformData.resolution,n.uRound=r._roundPixels|e._roundPixels,F(e.groupColorAlpha,n.uColor,0),this.adaptor.execute(this,e)}destroy(){this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class Pe extends ve{constructor(e){super(e,new ut)}}Pe.extension={type:[p.WebGLPipes],name:"particle"};class we extends ve{constructor(e){super(e,new lt)}}we.extension={type:[p.WebGPUPipes],name:"particle"};const Ce=class Se extends ot{constructor(e={}){e={...Se.defaultOptions,...e},super({width:e.width,height:e.height,verticesX:4,verticesY:4}),this.update(e)}update(e){var t,r;this.width=e.width??this.width,this.height=e.height??this.height,this._originalWidth=e.originalWidth??this._originalWidth,this._originalHeight=e.originalHeight??this._originalHeight,this._leftWidth=e.leftWidth??this._leftWidth,this._rightWidth=e.rightWidth??this._rightWidth,this._topHeight=e.topHeight??this._topHeight,this._bottomHeight=e.bottomHeight??this._bottomHeight,this._anchorX=(t=e.anchor)==null?void 0:t.x,this._anchorY=(r=e.anchor)==null?void 0:r.y,this.updateUvs(),this.updatePositions()}updatePositions(){const e=this.positions,{width:t,height:r,_leftWidth:a,_rightWidth:s,_topHeight:n,_bottomHeight:o,_anchorX:u,_anchorY:d}=this,h=a+s,l=t>h?1:t/h,c=n+o,f=r>c?1:r/c,x=Math.min(l,f),m=u*t,g=d*r;e[0]=e[8]=e[16]=e[24]=-m,e[2]=e[10]=e[18]=e[26]=a*x-m,e[4]=e[12]=e[20]=e[28]=t-s*x-m,e[6]=e[14]=e[22]=e[30]=t-m,e[1]=e[3]=e[5]=e[7]=-g,e[9]=e[11]=e[13]=e[15]=n*x-g,e[17]=e[19]=e[21]=e[23]=r-o*x-g,e[25]=e[27]=e[29]=e[31]=r-g,this.getBuffer("aPosition").update()}updateUvs(){const e=this.uvs;e[0]=e[8]=e[16]=e[24]=0,e[1]=e[3]=e[5]=e[7]=0,e[6]=e[14]=e[22]=e[30]=1,e[25]=e[27]=e[29]=e[31]=1;const t=1/this._originalWidth,r=1/this._originalHeight;e[2]=e[10]=e[18]=e[26]=t*this._leftWidth,e[9]=e[11]=e[13]=e[15]=r*this._topHeight,e[4]=e[12]=e[20]=e[28]=1-t*this._rightWidth,e[17]=e[19]=e[21]=e[23]=1-r*this._bottomHeight,this.getBuffer("aUV").update()}};Ce.defaultOptions={width:100,height:100,leftWidth:10,topHeight:10,rightWidth:10,bottomHeight:10,originalWidth:100,originalHeight:100};let gt=Ce;class xt extends q{constructor(){super(),this.geometry=new gt}destroy(){this.geometry.destroy()}}class Ue{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new xt,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}Ue.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"nineSliceSprite"};const _t={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},bt={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let D,A;class yt extends H{constructor(){D??(D=oe({name:"tiling-sprite-shader",bits:[tt,_t,ue]})),A??(A=le({name:"tiling-sprite-shader",bits:[rt,bt,de]}));const e=new w({uMapCoord:{value:new T,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new T,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:A,gpuProgram:D,resources:{localUniforms:new w({uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:v.EMPTY.source,uSampler:v.EMPTY.source.style}})}updateUniforms(e,t,r,a,s,n){const o=this.resources.tilingUniforms,u=n.width,d=n.height,h=n.textureMatrix,l=o.uniforms.uTextureTransform;l.set(r.a*u/e,r.b*u/t,r.c*d/e,r.d*d/t,r.tx/e,r.ty/t),l.invert(),o.uniforms.uMapCoord=h.mapCoord,o.uniforms.uClampFrame=h.uClampFrame,o.uniforms.uClampOffset=h.uClampOffset,o.uniforms.uTextureTransform=l,o.uniforms.uSizeAnchor[0]=e,o.uniforms.uSizeAnchor[1]=t,o.uniforms.uSizeAnchor[2]=a,o.uniforms.uSizeAnchor[3]=s,n&&(this.resources.uTexture=n.source,this.resources.uSampler=n.source.style)}}class Tt extends Y{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function vt(i,e){const t=i.anchor.x,r=i.anchor.y;e[0]=-t*i.width,e[1]=-r*i.height,e[2]=(1-t)*i.width,e[3]=-r*i.height,e[4]=(1-t)*i.width,e[5]=(1-r)*i.height,e[6]=-t*i.width,e[7]=(1-r)*i.height}function Pt(i,e,t,r){let a=0;const s=i.length/e,n=r.a,o=r.b,u=r.c,d=r.d,h=r.tx,l=r.ty;for(t*=e;a<s;){const c=i[t],f=i[t+1];i[t]=n*c+u*f+h,i[t+1]=o*c+d*f+l,t+=e,a++}}function wt(i,e){const t=i.texture,r=t.frame.width,a=t.frame.height;let s=0,n=0;i.applyAnchorToTexture&&(s=i.anchor.x,n=i.anchor.y),e[0]=e[6]=-s,e[2]=e[4]=1-s,e[1]=e[3]=-n,e[5]=e[7]=1-n;const o=T.shared;o.copyFrom(i._tileTransform.matrix),o.tx/=i.width,o.ty/=i.height,o.invert(),o.scale(i.width/r,i.height/a),Pt(e,2,0,o)}const B=new Tt;class Ct{constructor(){this.canBatch=!0,this.geometry=new Y({indices:B.indices.slice(),positions:B.positions.slice(),uvs:B.uvs.slice()})}destroy(){var e;this.geometry.destroy(),(e=this.shader)==null||e.destroy()}}class Be{constructor(e){this._state=R.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const a=t.canBatch;if(a&&a===r){const{batchableMesh:s}=t;return!s._batcher.checkAndUpdateTexture(s,e.texture)}return r!==a}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const a=this._getTilingSpriteData(e),{geometry:s,canBatch:n}=a;if(n){a.batchableMesh||(a.batchableMesh=new q);const o=a.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),o.geometry=s,o.renderable=e,o.transform=e.groupTransform,o.setTexture(e._texture)),o.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(o,t)}else r.break(t),a.shader||(a.shader=new yt),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,F(e.groupColorAlpha,r.uColor,0),this._state.blendMode=X(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:B,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:a}=t;e.didViewUpdate&&this._updateBatchableMesh(e),a._batcher.updateElement(a)}else if(e.didViewUpdate){const{shader:a}=t;a.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new Ct;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,a=e.texture.source.style;a.addressMode!=="repeat"&&(a.addressMode="repeat",a.update()),wt(e,r.uvs),vt(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let a=!0;return this._renderer.type===E.WEBGL&&(a=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(a||r.source.isPowerOfTwo),t.canBatch}}Be.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"tilingSprite"};const St={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},Ut={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},Bt={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},Rt={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let z,k;class Mt extends H{constructor(e){const t=new w({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});z??(z=oe({name:"sdf-shader",bits:[Le,Ee(e),St,Bt,ue]})),k??(k=le({name:"sdf-shader",bits:[Ye,Xe(e),Ut,Rt,de]})),super({glProgram:k,gpuProgram:z,resources:{localUniforms:t,batchSamplers:He(e)}})}}class Ft extends je{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class Re{constructor(e){this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuBitmapText")}validateRenderable(e){const t=this._getGpuBitmapText(e);return e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,t)),this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);te(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);te(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,a=qe.getFont(e.text,e._style);r.clear(),a.distanceField.type!=="none"&&(r.customShader||(r.customShader=new Mt(this._renderer.limits.maxBatchableTextures)));const s=$e.graphemeSegmenter(e.text),n=e._style;let o=a.baseLineOffset;const u=Ne(s,n,a,!0);let d=0;const h=n.padding,l=u.scale;let c=u.width,f=u.height+u.offsetY;n._stroke&&(c+=n._stroke.width/l,f+=n._stroke.width/l),r.translate(-e._anchor._x*c-h,-e._anchor._y*f-h).scale(l,l);const x=a.applyFillAsTint?n._fill.color:16777215;for(let m=0;m<u.lines.length;m++){const g=u.lines[m];for(let _=0;_<g.charPositions.length;_++){const $=s[d++],P=a.chars[$];P!=null&&P.texture&&r.texture(P.texture,x||"black",Math.round(g.charPositions[_]+P.xOffset),Math.round(o+P.yOffset))}o+=a.lineHeight}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Ft;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,a=V.get(`${r}-bitmap`),{a:s,b:n,c:o,d:u}=e.groupTransform,d=Math.sqrt(s*s+n*n),h=Math.sqrt(o*o+u*u),l=(Math.abs(d)+Math.abs(h))/2,c=a.baseRenderedFontSize/e._style.fontSize,f=l*a.distanceField.range*(1/c);t.customShader.resources.localUniforms.uniforms.uDistance=f}destroy(){this._renderer=null}}Re.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"bitmapText"};function te(i,e){e.groupTransform=i.groupTransform,e.groupColorAlpha=i.groupColorAlpha,e.groupColor=i.groupColor,e.groupBlendMode=i.groupBlendMode,e.globalDisplayStatus=i.globalDisplayStatus,e.groupTransform=i.groupTransform,e.localDisplayStatus=i.localDisplayStatus,e.groupAlpha=i.groupAlpha,e._roundPixels=i._roundPixels}class Gt extends fe{constructor(e){super(),this.generatingTexture=!1,this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.htmlText.returnTexturePromise(this.texturePromise),this.texturePromise=null,this._renderer=null}}function L(i,e){const{texture:t,bounds:r}=i;Qe(r,e._anchor,t);const a=e._style._getFinalPadding();r.minX-=a,r.minY-=a,r.maxX-=a,r.maxY-=a}class Me{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e).catch(a=>{console.error(a)}),e._didTextUpdate=!1,L(r,e)),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;t.texturePromise&&(this._renderer.htmlText.returnTexturePromise(t.texturePromise),t.texturePromise=null),t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const r=this._renderer.htmlText.getTexturePromise(e);t.texturePromise=r,t.texture=await r;const a=e.renderGroup||e.parentRenderGroup;a&&(a.structureDidChange=!0),t.generatingTexture=!1,L(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Gt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=v.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Me.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"htmlText"};function Dt(){const{userAgent:i}=ce.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(i)}const At=new ie;function Fe(i,e,t,r){const a=At;a.minX=0,a.minY=0,a.maxX=i.width/r|0,a.maxY=i.height/r|0;const s=y.getOptimalTexture(a.width,a.height,r,!1);return s.source.uploadMethodId="image",s.source.resource=i,s.source.alphaMode="premultiply-alpha-on-upload",s.frame.width=e/r,s.frame.height=t/r,s.source.emit("update",s.source),s.updateUvs(),s}function zt(i,e){const t=e.fontFamily,r=[],a={},s=/font-family:([^;"\s]+)/g,n=i.match(s);function o(u){a[u]||(r.push(u),a[u]=!0)}if(Array.isArray(t))for(let u=0;u<t.length;u++)o(t[u]);else o(t);n&&n.forEach(u=>{const d=u.split(":")[1].trim();o(d)});for(const u in e.tagStyles){const d=e.tagStyles[u].fontFamily;o(d)}return r}async function kt(i){const t=await(await ce.get().fetch(i)).blob(),r=new FileReader;return await new Promise((s,n)=>{r.onloadend=()=>s(r.result),r.onerror=n,r.readAsDataURL(t)})}async function re(i,e){const t=await kt(e);return`@font-face {
        font-family: "${i.fontFamily}";
        src: url('${t}');
        font-weight: ${i.fontWeight};
        font-style: ${i.fontStyle};
    }`}const U=new Map;async function Wt(i,e,t){const r=i.filter(a=>V.has(`${a}-and-url`)).map((a,s)=>{if(!U.has(a)){const{url:n}=V.get(`${a}-and-url`);s===0?U.set(a,re({fontWeight:e.fontWeight,fontStyle:e.fontStyle,fontFamily:a},n)):U.set(a,re({fontWeight:t.fontWeight,fontStyle:t.fontStyle,fontFamily:a},n))}return U.get(a)});return(await Promise.all(r)).join(`
`)}function It(i,e,t,r,a){const{domElement:s,styleElement:n,svgRoot:o}=a;s.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${i}</div>`,s.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),n.textContent=r;const{width:u,height:d}=a.image;return o.setAttribute("width",u.toString()),o.setAttribute("height",d.toString()),new XMLSerializer().serializeToString(o)}function Ot(i,e){const t=he.getOptimalCanvasAndContext(i.width,i.height,e),{context:r}=t;return r.clearRect(0,0,i.width,i.height),r.drawImage(i,0,0),t}function Vt(i,e,t){return new Promise(async r=>{t&&await new Promise(a=>setTimeout(a,100)),i.onload=()=>{r()},i.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,i.crossOrigin="anonymous"})}class Ge{constructor(e){this._renderer=e,this._createCanvas=e.type===E.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:a,textureStyle:s}=e,n=M.get(Ke),o=zt(t,r),u=await Wt(o,r,Je.defaultTextStyle),d=Ze(t,r,u,n),h=Math.ceil(Math.ceil(Math.max(1,d.width)+r.padding*2)*a),l=Math.ceil(Math.ceil(Math.max(1,d.height)+r.padding*2)*a),c=n.image,f=2;c.width=(h|0)+f,c.height=(l|0)+f;const x=It(t,r,a,u,n);await Vt(c,x,Dt()&&o.length>0);const m=c;let g;this._createCanvas&&(g=Ot(c,a));const _=Fe(g?g.canvas:m,c.width-f,c.height-f,a);return s&&(_.source.style=s),this._createCanvas&&(this._renderer.texture.initSource(_.source),he.returnCanvasAndContext(g)),M.return(n),_}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{ne("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){y.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null}}Ge.extension={type:[p.WebGLSystem,p.WebGPUSystem,p.CanvasSystem],name:"htmlText"};class Lt extends fe{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.canvasText.returnTexture(this.texture),this._renderer=null}}class De{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e),e._didTextUpdate=!1),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.returnTexture(t.texture),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=t.texture=this._renderer.canvasText.getTexture(e),L(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Lt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}De.extension={type:[p.WebGLPipes,p.WebGPUPipes,p.CanvasPipes],name:"text"};class Ae{constructor(e){this._renderer=e}getTexture(e,t,r,a){typeof e=="string"&&(W("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof Q||(e.style=new Q(e.style)),e.textureStyle instanceof O||(e.textureStyle=new O(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:s,style:n,textureStyle:o}=e,u=e.resolution??this._renderer.resolution,{frame:d,canvasAndContext:h}=G.getCanvasAndContext({text:s,style:n,resolution:u}),l=Fe(h.canvas,d.width,d.height,u);if(o&&(l.source.style=o),n.trim&&(d.pad(n.padding),l.frame.copyFrom(d),l.updateUvs()),n.filters){const c=this._applyFilters(l,n.filters);return this.returnTexture(l),G.returnCanvasAndContext(h),c}return this._renderer.texture.initSource(l._source),G.returnCanvasAndContext(h),l}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",y.returnTexture(e,!0)}renderTextToCanvas(){W("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,a=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),a}destroy(){this._renderer=null}}Ae.extension={type:[p.WebGLSystem,p.WebGPUSystem,p.CanvasSystem],name:"canvasText"};b.add(pe);b.add(me);b.add(_e);b.add(et);b.add(Te);b.add(Pe);b.add(we);b.add(Ae);b.add(De);b.add(Re);b.add(Ge);b.add(Me);b.add(Be);b.add(Ue);b.add(xe);b.add(ge);
