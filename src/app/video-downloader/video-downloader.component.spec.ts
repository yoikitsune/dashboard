import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDownloaderComponent } from './video-downloader.component';

describe('VideoDownloaderComponent', () => {
  let component: VideoDownloaderComponent;
  let fixture: ComponentFixture<VideoDownloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoDownloaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
