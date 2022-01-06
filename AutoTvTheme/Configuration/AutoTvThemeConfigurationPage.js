AutoTvTheme(["loading", "dialogHelper", "formDialogStyle", "emby-checkbox", "emby-select", "emby-toggle"],
    function(loading, dialogHelper) {

        var pluginId = "B460B122-040F-49DE-94AD-9A352DDE6CA6";

        
        

        ApiClient.getPrimaryImageUrl = function(itemId) {
            var url = this.getUrl('Items/' +
                itemId +
                '/Images/Primary?maxHeight=85&amp;maxWidth=65&amp;quality=90');
            return url;
        }

        function updateTags(internalId, tags) {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('UpdateTags?Internal=' + internalId + '&Tags=' + tags)).then(result => {
                        resolve(result);
                });
            });
        }

        function getTags(internalId, type) {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('Items?ExcludeLocationTypes=Virtual&Recursive=true&IncludeItemTypes=' + type + '&SortBy=SortName&Fields=Tags&Ids=' + internalId)).then(result => { 
                    resolve(result);
                });
            });
        }

        function getItemsByRating(startIndex, type, rating) {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('Items?Fields=MediaStreams%2CProductionYear%2COfficialRating&ExcludeLocationTypes=Virtual&Recursive=true&IncludeItemTypes=' + type + '&SortBy=SortName&OfficialRatings=' + rating + '&StartIndex=' + startIndex + '&Limit=20')).then(result => { 
                    resolve(result);
                });
            });
        }

        function getContainers(type) {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('Containers?IncludeItemTypes=' + type)).then(result => { 
                    resolve(result);
                });
            });
        }

        function getVideoCodec() {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('VideoCodecs')).then(result => { 
                    resolve(result);
                });
            });
        }

        function getYears() {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('Years')).then(result => { 
                    resolve(result);
                });
            });
        }

        function getAudioCodec() {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('AudioCodecs')).then(result => { 
                    resolve(result);
                });
            });
        }
        
        function getOfficialRatings() {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('OfficialRatings')).then(result => { 
                    resolve(result);
                });
            });
        }

        function getItemTypes() {
            return new Promise((resolve, reject) => {
                ApiClient.getJSON(ApiClient.getUrl('ItemTypes')).then(result => { 
                    resolve(result);
                });
            });
        }


        function openTagDialog(view, id) {
            loading.show();

            var dlg = dialogHelper.createDialog({
                size: "medium-tall",
                removeOnClose: !1,
                scrollY: true
            });

            dlg.classList.add("formDialog");
            dlg.classList.add("ui-body-a");
            dlg.classList.add("background-theme-a");
            dlg.style.maxWidth = "45%";
            dlg.style.maxHeight = "87%";

            var html = '';

            html += '<div class="formDialogHeader" style="display:flex">';
            html += '<button is="paper-icon-button-light" class="btnCloseDialog autoSize paper-icon-button-light" tabindex="-1"><i class="md-icon">arrow_back</i></button><h3 class="formDialogHeaderTitle">Advanced settings</h3>';
            html += '</div>';

            html += '<div class="formDialogContent scrollY" style="margin:2em">';
            html += '<div class="dialogContentInner" style="max-height: 42em; margin:2em">';
            html += '<div style="flex-grow:1;">';

            //Overwrite tags, or merge
            html += '<div class="inputContainer">';
            html += '<label style="width: auto;" class="mdl-switch mdl-js-switch">';
            html += '<input is="emby-toggle" type="checkbox" id="overwriteTags"  class="chkOverwriteTags noautofocus mdl-switch__input" data-embytoggle="true">';
            html += '<span class="toggleButtonLabel mdl-switch__label">Overwrite Tags</span>';
            html += '<div class="mdl-switch__trackContainer">';
            html += '<div class="mdl-switch__track"></div>';
            html += '<div class="mdl-switch__thumb">';
            html += '<span class="mdl-switch__focus-helper"></span>';
            html += '</div>';
            html += '</div>';
            html += '</label>';
            html += '<div class="fieldDescription">If selected, tags will over-write all current tags list applied to library items. Default, will merge to current tags</div>';
            html += '</div>';


            html += '<div style="display: flex; align-items: center;">';
            html += '<!-- Emby Type List -->';
            html += '<div style="flex-grow: 1;" class="selectContainer">';
            html += '<label class="selectLabel" for="selectItemType">Item Type:</label>';
            html += '<select is="emby-select" name="selectItemType" id="selectItemType" label="Item Type:" data-mini="true" class="emby-select-withcolor emby-select">';
            html += '</select>';
            html += '<div class="selectArrowContainer">';
            html += '<div style="visibility: hidden;">0</div><i class="selectArrow md-icon"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>'; 

            html += '<div style="display: flex; align-items: center;">';
            html += '<!-- Emby Official Ratings List -->';
            html += '<div style="flex-grow: 1;" class="selectContainer">';
            html += '<label class="selectLabel" for="selectEmbyParentalRatings">Parental Ratings:</label>';
            html += '<select is="emby-select" name="selectEmbyParentalRatings" id="selectEmbyParentalRatings" label="Parental Ratings:" data-mini="true" class="emby-select-withcolor emby-select">';
            html += '<option value=""></option>';
            html += '</select>';
            html += '<div class="selectArrowContainer">';
            html += '<div style="visibility: hidden;">0</div><i class="selectArrow md-icon"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '<div style="display: flex; align-items: center;">';
            html += '<!-- Emby Media Container List -->';
            html += '<div style="flex-grow: 1;" class="selectContainer">';
            html += '<label class="selectLabel" for="selectEmbyMediaContainer">Media Container:</label>';
            html += '<select is="emby-select" name="selectEmbyMediaContainer" id="selectEmbyMediaContainer" label="Container:" data-mini="true" class="emby-select-withcolor emby-select">';
            html += '<option value=""></option>';
            html += '</select>';
            html += '<div class="selectArrowContainer">';
            html += '<div style="visibility: hidden;">0</div><i class="selectArrow md-icon"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '<div style="display: flex; align-items: center;">';
            html += '<!-- Emby Video Codec List -->';
            html += '<div style="flex-grow: 1;" class="selectContainer">';
            html += '<label class="selectLabel" for="selectEmbyVideoCodec">Video Codec:</label>';
            html += '<select is="emby-select" name="selectEmbyVideoCodec" id="selectEmbyVideoCodec" label="Container:" data-mini="true" class="emby-select-withcolor emby-select">';
            html += '<option value=""></option>';
            html += '</select>';
            html += '<div class="selectArrowContainer">';
            html += '<div style="visibility: hidden;">0</div><i class="selectArrow md-icon"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '<div style="display: flex; align-items: center;">';
            html += '<!-- Emby Year List -->';
            html += '<div style="flex-grow: 1;" class="selectContainer">';
            html += '<label class="selectLabel" for="selectEmbyYears">Years:</label>';
            html += '<select is="emby-select" name="selectEmbyYears" id="selectEmbyYears" label="Years:" data-mini="true" class="emby-select-withcolor emby-select">';
            html += '<option value=""></option>';
            html += '</select>';
            html += '<div class="selectArrowContainer">';
            html += '<div style="visibility: hidden;">0</div><i class="selectArrow md-icon"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            
            html += '<div style="display: flex; align-items: center;">';
            html += '<!-- Emby Audio Codec List -->';
            html += '<div style="flex-grow: 1;" class="selectContainer">';
            html += '<label class="selectLabel" for="selectEmbyAudioCodec">Audio Codec:</label>';
            html += '<select is="emby-select" name="selectEmbyAudioCodec" id="selectEmbyAudioCodec" label="Years:" data-mini="true" class="emby-select-withcolor emby-select">';
            html += '<option value=""></option>';
            html += '</select>';
            html += '<div class="selectArrowContainer">';
            html += '<div style="visibility: hidden;">0</div><i class="selectArrow md-icon"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '<div style="display: flex; align-items: center;">';
            html += '<!-- Emby Video Resolution List -->';
            html += '<div style="flex-grow: 1;" class="selectContainer">';
            html += '<label class="selectLabel" for="selectEmbyVideoResolution">Video Resolution:</label>';
            html += '<select is="emby-select" name="selectEmbyVideoResolution" id="selectEmbyVideoResolution" label="Video Resolution:" data-mini="true" class="emby-select-withcolor emby-select">';
            html += '<option value=""></option>';
            html += '<option value="720p">720p</option>';
            html += '<option value="1080p">1080p</option>';
            html += '<option value="4k">4k</option>';
            html += '</select>';
            html += '<div class="selectArrowContainer">';
            html += '<div style="visibility: hidden;">0</div><i class="selectArrow md-icon"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="inputContainer">'; 
            html += '<div class="flex-grow">';
            html += '<label class="inputLabel inputLabelUnfocused" for="txtTag">Tag:</label><input id="txtTag" label="Tags:" autocomplete="off" class="emby-input">';
            html += '</div>';
            html += '<div class="fieldDescription">Comma delimited list of tags to add to the rule.</div>';
            html += '</div>'; 
             
            
            html += '<div class="inputContainer">';
            html += '<button is="emby-button" type="submit" class="btnSave raised button-submit block emby-button">';
            html += '<span>Save</span>';
            html += '</button>'; 
            html += '</div>'; 

            html += '</div>';
            html += '</div>';
            html += '</div>';

            dlg.innerHTML = html;
            dialogHelper.open(dlg);

            var itemTypeSelect       = dlg.querySelector('#selectItemType');
            var ratingSelect         = dlg.querySelector('#selectEmbyParentalRatings');
            var mediaContainerSelect = dlg.querySelector('#selectEmbyMediaContainer');
            var videoCodecSelect     = dlg.querySelector('#selectEmbyVideoCodec');
            var audioCodecSelect     = dlg.querySelector('#selectEmbyAudioCodec');
            var yearsSelect          = dlg.querySelector('#selectEmbyYears');
            var resolutionSelect     = dlg.querySelector('#selectEmbyVideoResolution');

            var overwriteTags = dlg.querySelector('#overwriteTags');

            var saveBtn              = dlg.querySelector('.btnSave');
            var tagInput             = dlg.querySelector('#txtTag');
            var ruleList             = view.querySelector('.ruleList');

            getOfficialRatings().then(ratingsResult => {
                ratingsResult.Items.forEach(rating => {
                    ratingSelect.innerHTML += '<option value="' + rating.Name + '">' + rating.Name + '</option>';
                });
                getContainers().then(containerResults => {
                    containerResults.Items.forEach(container => {
                        mediaContainerSelect.innerHTML += '<option value="' + container.Name + '">' + container.Name + '</option>';
                    });
                    getVideoCodec().then(videoCodecResults => {
                        videoCodecResults.Items.forEach(videoCodec => {
                            videoCodecSelect.innerHTML += '<option value="' + videoCodec.Name + '">' + videoCodec.Name + '</option>';
                        });
                        getYears().then(yearResults => {
                            yearResults.Items.forEach(year => {
                                yearsSelect.innerHTML += '<option value="' + year.Name + '">' + year.Name + '</option>'; 
                            });
                            getItemTypes().then(itemTypeResults => {
                                itemTypeResults.Items.forEach(type => {
                                    itemTypeSelect.innerHTML += '<option value="' + type.Name + '">' + type.Name + '</option>';
                                });
                                getAudioCodec().then(audioCodecResults => {
                                    audioCodecResults.Items.forEach(audioCodec => {
                                        audioCodecSelect.innerHTML += '<option value="' + audioCodec.Name + '">' + audioCodec.Name + '</option>';
                                    });
                                    loading.hide();
                                });
                            });
                        });
                    });
                });
            });
             
            dlg.querySelector('.btnCloseDialog').addEventListener('click',() => {
                dialogHelper.close(dlg);
            });


            
            ApiClient.getPluginConfiguration(pluginId).then((config) => {
                var rule = config.Rules.filter(rule => rule.Id === id);
                if (rule) {
                    if (rule.Profile.Type) itemTypeSelect.value         = rule.Profile.Type;
                    if (rule.Profile.Rating) ratingSelect.value         = rule.Profile.Rating;
                    if (rule.Container) mediaContainerSelect.value      = rule.Profile.Container;
                    if (rule.Profile.VideoCodec) videoCodecSelect.value = rule.Profile.VideoCodec;
                    if (rule.Profile.Resolution) resolutionSelect.value = rule.Profile.Resolution;
                    if (rule.Profile.Year) yearSelect.value             = rule.Profile.Year;
                    if (rule.Profile.AudioCodec) audioCodecSelect.value = rule.Profile.AudioCodec;
                }
            });
            
            
            saveBtn.addEventListener('click',
                (e) => {
                    ApiClient.getPluginConfiguration(pluginId).then((config) => {

                        var rules   = [];
                        var rule    = {};

                        var tags    = [];
                        var profile = {};

                            
                        if (config.Rules) {
                            rules = config.Rules;
                        } 

                        if (id) {
                            rule = rules.filter(r => r.Id == id);
                        }

                        if (config.Tags) {
                            tags = config.Tags;
                        }

                        
                        tagInput.value.split(',').forEach(tag => {
                            tags.push(tag);
                        });

                        profile = {
                            Type            : itemTypeSelect[itemTypeSelect.selectedIndex].value !== ''             ? (itemTypeSelect[itemTypeSelect.selectedIndex].value)             : "",
                            Rating          : ratingSelect[ratingSelect.selectedIndex].value !== ''                 ? (ratingSelect[ratingSelect.selectedIndex].value)                 : "",
                            Container       : mediaContainerSelect[mediaContainerSelect.selectedIndex].value !== '' ? (mediaContainerSelect[mediaContainerSelect.selectedIndex].value) : "",
                            VideoCodec      : videoCodecSelect[videoCodecSelect.selectedIndex].value !== ''         ? (videoCodecSelect[videoCodecSelect.selectedIndex].value)         : "",
                            Resolution      : resolutionSelect[resolutionSelect.selectedIndex].value !== ''         ? (resolutionSelect[resolutionSelect.selectedIndex].value)         : "",
                            AudioCodec      : audioCodecSelect[audioCodecSelect.selectedIndex].value !== ''         ? (audioCodecSelect[audioCodecSelect.selectedIndex].value)         : "",
                            Year            : yearsSelect[yearsSelect.selectedIndex].value !== ''                   ? (yearsSelect[yearsSelect.selectedIndex].value)                   : ""
                        }
                        
                        rule = {
                            Profile       : profile,
                            Tags          : tags,
                            OverwriteTags : overwriteTags.checked,
                            Id            : id ? id : Math.floor(100000 + Math.random() * 900000)
                        }
                        
                        rules.push(rule);
                        config.Rules = rules;

                        ApiClient.updatePluginConfiguration(pluginId, config).then((result) => {

                            ruleList.innerHTML = '';
                            rules.forEach(rule => {
                               
                                ruleList.innerHTML += renderListItem(rule);
                                removeRuleListItem(ruleList, config);

                            }); 
                            dialogHelper.close(dlg);

                        });
                        
                    });
                   
                });

        }

        function renderListItem(rule) {

            var html = '';
            html += '<div id="' + rule.Id + '"  class="listItem listItem-border">';
            html += '<div>';
            html += ' <button is="emby-button" id="editTagRule" class="fab emby-input-iconbutton paper-icon-button-light emby-button" style="margin-left: 1em;"><i class="md-icon">edit</i></button>';
            //html += '<svg style="width:24px;height:24px" viewBox="0 0 24 24">';
            //html += '<path fill="darkgrey" d="M4 2V8H2V2H4M2 22V16H4V22H2M5 12C5 13.11 4.11 14 3 14C1.9 14 1 13.11 1 12C1 10.9 1.9 10 3 10C4.11 10 5 10.9 5 12M24 6V18C24 19.11 23.11 20 22 20H10C8.9 20 8 19.11 8 18V14L6 12L8 10V6C8 4.89 8.9 4 10 4H22C23.11 4 24 4.89 24 6Z" />';
            //html += '</svg>';
            html += '</div>';

            html += '<div style="display:block; margin-right:2em">';
            html += '<ul>'
            if (rule.Profile.Type)       html += "<li>Type: " + rule.Profile.Type       + '</li>';
            if (rule.Profile.Rating)     html += "<li>Rating: "  + rule.Profile.Rating  + '</li>';
            if (rule.Profile.Container)  html += "<li>Container: " + rule.Profile.Container  + '</li>';
            if (rule.Profile.VideoCodec) html += "<li>Video Codec: " + rule.Profile.VideoCodec + '</li>';
            if (rule.Profile.Resolution) html += "<li>Resolution: " + rule.Profile.Resolution + '</li>';
            if (rule.Profile.Year)       html += "<li>Year: " + rule.Profile.Year       + '</li>';
            if (rule.Profile.AudioCodec) html += "<li>Audio Cocec: " + rule.Profile.AudioCodec + '</li>';
            html += '</ul>';
            html += '</div>';

            html += '<div style="border-left: 1px solid darkgrey;display: inline;text-align: center;" class="listItemBody two-line listItemBodyText">';
            html += '<svg style="width:24px;height:24px" viewBox="0 0 24 24">';
            html += '<path fill="darkgrey" d="M21.4 11.6L12.4 2.6C12 2.2 11.5 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.5 2.2 12 2.6 12.4L11.6 21.4C12 21.8 12.5 22 13 22C13.5 22 14 21.8 14.4 21.4L21.4 14.4C21.8 14 22 13.5 22 13C22 12.5 21.8 12 21.4 11.6M13 20L4 11V4H11L20 13M6.5 5C7.3 5 8 5.7 8 6.5S7.3 8 6.5 8 5 7.3 5 6.5 5.7 5 6.5 5M10.1 8.9L11.5 7.5L17 13L15.6 14.4L10.1 8.9M7.6 11.4L9 10L13 14L11.6 15.4L7.6 11.4Z" />';
            html += '</svg>';
            html += '<h3> ' + rule.Tags.join('|') + '</h3>';       
            html += '</div>';
            html += '<button type="button" is="paper-icon-button-light" title="Remove" class="listItemButton btnRemove paper-icon-button-light">';
            html += '<i class="md-icon">close</i>';
            html += '</button>';
            html += '</div>';
            return html;
        }

        function removeRuleListItem(list, config) {
            list.querySelectorAll('.listItem').forEach(item => {
                item.querySelectorAll('.btnRemove').forEach(removeBtn => {
                    removeBtn.addEventListener('click',
                        (elem) => {

                            var removeValue = elem.target.closest('.listItem').id;
                            
                            config.Rules = config.Rules.filter(rule => rule.Id != removeValue);

                            ApiClient.updatePluginConfiguration(pluginId, config).then((result) => {
                                list.innerHTML = ' ';
                                if (config.Rules) {
                                    config.Rules.forEach(rule => {
                                       
                                        list.innerHTML += renderListItem(rule);
                                        removeRuleListItem(list, config);
                                    });
                                }
                            });

                            
                        });
                });
            });
        }
        
        return function(view) {
            view.addEventListener('viewshow',
                () => {
                  
                    //var table          = view.querySelector('.baseItemResultBody');
                    var tableOptions = view.querySelector('#createTagRule');

                    tableOptions.addEventListener('click',
                        (e) => {
                            openTagDialog(view);
                        });

                    var ruleList = view.querySelector('.ruleList');
                    ApiClient.getPluginConfiguration(pluginId).then((config) => {

                        ruleList.innerHTML = '';
                        if (config.Rules) {
                            config.Rules.forEach(rule => {
                                
                                ruleList.innerHTML += renderListItem(rule);

                                removeRuleListItem(ruleList, config);
                            });
                        }
                    }); 
                });
        }
    });