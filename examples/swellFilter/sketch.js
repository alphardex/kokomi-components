import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const sc = new kokomi.ScreenCamera(this);
    sc.addExisting();

    new kokomi.OrbitControls(this);

    // scroller
    const scr = new kokomi.NormalScroller();
    scr.listenForScroll();

    // gallery
    const ga = new kokomi.Gallery(this, {
      scroller: scr,
    });
    ga.addExisting();

    // swell filter
    const sfConfig = {
      intensity: 1,
    };
    const sf = new kokomiComponents.SwellFilter(this, sfConfig);
    sf.addExisting();

    this.update(() => {
      sf.linkScroll(scr.scroll.delta);
    });

    await ga.checkImagesLoaded();

    document.querySelector(".loader-screen").classList.add("hollow");
  }
}
