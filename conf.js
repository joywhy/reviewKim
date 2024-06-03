const {assign} = Object;
Object.defineProperties(self, {
	// INIT_MAP: {value: new Map},
	// COMP_MAP: {value: new Map},

	// DIR: {value: '.'},
	// COMP_DIR: {get(){return `${DIR}/comp`}},
	// IMG_DIR: {get(){return `${DIR}/img`}},
	DB_HOST: {value: 'db.seu.ai'},
})
assign(self, {
  await_i: 1,
  res(i, data){
    dispatchEvent(new CustomEvent(`await ${i}`, {detail: data}));
  },
  DELAY_LIST: new Map,
  delay(_ = 250, $){
    return new Promise((res, rej) => {
      if(typeof _ == 'number'){
        DELAY_LIST.set(
          rej,
          setTimeout(() => {
            DELAY_LIST.delete(rej);
            res()
          }, _)
        );
      }else{
        ($ || self).addEventListener(_, e => {
          DELAY_LIST.delete(rej);
          res(e);
        }, {passive: true, once: true});
        DELAY_LIST.set(
          rej,
          () => ($ || self).removeEventListener(_, res)
        );
      }
    });
  },
  async onready(){
    await import('https://seu.ai/brotli.js');
    const {
      compress,
      decompress
    } = await brotliwasm.load();
    assign(self, {
      enBrotli(blob){return compress(blob, 4096, 11)},
      deBrotli(blob){return new TextDecoder().decode(decompress(blob))},
      async req(cmd, data){
        if(ws.readyState == ws.CLOSED){
          await ws.reload();
        }
        ws.send(enBrotli(new TextEncoder().encode(`${cmd}\x1D${JSON.stringify(assign(data || {}, {await_i}))}`)));
        return (await delay(`await ${await_i++}`)).detail;
      },
      logout(){
        ws.close();
        delete cookie.my;
        DATA.my = {};
      }
    })
    assign(self.ws = {}, {
      url: `wss://${DB_HOST}//${location.host}`,
      async reload(){
        assign(self.ws = new WebSocket(this.url), {
          reload: this.reload,
          onerror: this.onerror,
          onmessage: this.onmessage,
          onclose: this.onclose
        });
        await delay('open', ws);
      },
      async onclose(e){
        await delay(1000);
        if(!ws.state){
          this.reload();
          return;
        }
        /*
        if(
          ws.state.readyState != ws.state.OPEN &&
          e.code == 1000 &&
          e.reason
        ){
          logout()
        }
        */
      },
      async onerror(e){
        await this.reload();
      },
      async onmessage({data}){
        const [i, detail] = deBrotli(new Uint8Array(await data.arrayBuffer())).split('\x1D')
        res(i, detail ? JSON.parse(detail) : {});
      }
    })

    // if(!cookie.my) return;
    // DATA.my = {id: cookie.my};
    ws.reload();
    await delay('open', ws);
    // DATA.list = await req('list');
  },

  cookie: new Proxy({}, {
    get(target, key) {
      return localStorage.getItem(`cookie/${key}`);
    },
    set(target, key, val){
      fetch(`//${DB_HOST}`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({[key]: val}),
      })
      localStorage.setItem(`cookie/${key}`, val);
      return true;
    },
    deleteProperty(target, key){
      fetch(`//${DB_HOST}`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({[key]: null}),
      })
      localStorage.removeItem(`cookie/${key}`);
      return true;
    }
  })
});
onreaday();